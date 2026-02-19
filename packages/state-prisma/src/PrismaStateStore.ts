import type {
  BatchState,
  JobState,
  JobProgress,
  ProcessedRecord,
  DistributedStateStore,
  ClaimBatchResult,
  DistributedJobStatus,
} from '@batchactions/core';
import type { PrismaBatchactionsClient } from './types/PrismaClientInterface.js';
import * as JobMapper from './mappers/JobMapper.js';
import * as RecordMapper from './mappers/RecordMapper.js';
import { parseJson } from './utils/parseJson.js';

export interface PrismaStateStoreOptions {
  readonly tablePrefix?: string;
}

/**
 * Prisma-based StateStore adapter for `@batchactions/core`.
 *
 * Persists import job state and processed records to a relational database
 * using Prisma. Supports any database supported by Prisma (PostgreSQL,
 * MySQL, MariaDB, SQLite, SQL Server, CockroachDB).
 *
 * Also implements `DistributedStateStore` for distributed multi-worker
 * batch processing with atomic batch claiming and job finalization.
 *
 * Compatible with both Prisma v6 and v7. The user provides their own
 * PrismaClient instance with the batchactions models defined.
 *
 * **Setup:**
 * 1. Copy models from `prisma/batchactions.prisma` into your schema
 *    (or run `npx batchactions-prisma init`)
 * 2. Run `prisma migrate dev` and `prisma generate`
 * 3. Pass your PrismaClient to the constructor
 *
 * **Limitation:** Non-serializable schema fields (`customValidator`, `transform`,
 * `pattern`) are stripped when saving. The consumer must re-inject them when
 * restoring a job from the database.
 */
export class PrismaStateStore implements DistributedStateStore {
  private readonly prisma: PrismaBatchactionsClient;

  constructor(prisma: PrismaBatchactionsClient, _options?: PrismaStateStoreOptions) {
    this.prisma = prisma;
  }

  // ── StateStore methods ──────────────────────────────────────────────

  async saveJobState(job: JobState): Promise<void> {
    const row = JobMapper.toRow(job);
    await this.prisma.batchactionsJob.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  async getJobState(jobId: string): Promise<JobState | null> {
    const row = await this.prisma.batchactionsJob.findUnique({
      where: { id: jobId },
    });
    if (!row) return null;
    return JobMapper.toDomain(row);
  }

  async updateBatchState(jobId: string, batchId: string, state: BatchState): Promise<void> {
    const row = await this.prisma.batchactionsJob.findUnique({
      where: { id: jobId },
    });
    if (!row) return;

    const batches = parseJson(row.batches) as Array<{
      id: string;
      status: string;
      processedCount: number;
      failedCount: number;
    }>;

    const updated = batches.map((b) =>
      b.id === batchId
        ? { ...b, status: state.status, processedCount: state.processedCount, failedCount: state.failedCount }
        : b,
    );

    await this.prisma.batchactionsJob.update({
      where: { id: jobId },
      data: { batches: JSON.stringify(updated) },
    });

    // Also update the distributed batch table if it exists
    try {
      await this.prisma.batchactionsBatch.update({
        where: { id: batchId },
        data: {
          status: state.status,
          processedCount: state.processedCount,
          failedCount: state.failedCount,
        },
      });
    } catch {
      // Batch row may not exist in non-distributed mode
    }
  }

  async saveProcessedRecord(jobId: string, batchId: string, record: ProcessedRecord): Promise<void> {
    const row = RecordMapper.toRow(jobId, batchId, record);

    const existing = await this.prisma.batchactionsRecord.findFirst({
      where: { jobId, recordIndex: record.index },
    });

    if (existing) {
      await this.prisma.batchactionsRecord.update({
        where: { id: existing.id },
        data: row,
      });
    } else {
      await this.prisma.batchactionsRecord.create({ data: row });
    }
  }

  async getFailedRecords(jobId: string): Promise<readonly ProcessedRecord[]> {
    const rows = await this.prisma.batchactionsRecord.findMany({
      where: { jobId, status: { in: ['failed', 'invalid'] } },
      orderBy: { recordIndex: 'asc' },
    });
    return rows.map((r) => RecordMapper.toDomain(r));
  }

  async getPendingRecords(jobId: string): Promise<readonly ProcessedRecord[]> {
    const rows = await this.prisma.batchactionsRecord.findMany({
      where: { jobId, status: { in: ['pending', 'valid'] } },
      orderBy: { recordIndex: 'asc' },
    });
    return rows.map((r) => RecordMapper.toDomain(r));
  }

  async getProcessedRecords(jobId: string): Promise<readonly ProcessedRecord[]> {
    const rows = await this.prisma.batchactionsRecord.findMany({
      where: { jobId, status: 'processed' },
      orderBy: { recordIndex: 'asc' },
    });
    return rows.map((r) => RecordMapper.toDomain(r));
  }

  async getProgress(jobId: string): Promise<JobProgress> {
    const jobRow = await this.prisma.batchactionsJob.findUnique({
      where: { id: jobId },
    });

    const counts = (await this.prisma.batchactionsRecord.groupBy({
      by: ['status'],
      where: { jobId },
      _count: { status: true },
    })) as Array<{ status: string; _count: { status: number } }>;

    const countMap = new Map<string, number>();
    for (const row of counts) {
      countMap.set(row.status, row._count.status);
    }

    const processed = countMap.get('processed') ?? 0;
    const failed = (countMap.get('failed') ?? 0) + (countMap.get('invalid') ?? 0);
    const totalRecords = jobRow?.totalRecords ?? 0;
    const pending = Math.max(0, totalRecords - processed - failed);
    const completed = processed + failed;

    const batches = jobRow ? (parseJson(jobRow.batches) as Array<{ status: string }>) : [];
    const completedBatches = batches.filter((b) => b.status === 'COMPLETED').length;
    const elapsed = jobRow?.startedAt ? Date.now() - Number(jobRow.startedAt) : 0;

    return {
      totalRecords,
      processedRecords: processed,
      failedRecords: failed,
      pendingRecords: pending,
      percentage: totalRecords > 0 ? Math.round((completed / totalRecords) * 100) : 0,
      currentBatch: completedBatches,
      totalBatches: batches.length,
      elapsedMs: elapsed,
    };
  }

  // ── DistributedStateStore methods ───────────────────────────────────

  async claimBatch(jobId: string, workerId: string): Promise<ClaimBatchResult> {
    const jobRow = await this.prisma.batchactionsJob.findUnique({
      where: { id: jobId },
    });
    if (!jobRow) {
      return { claimed: false, reason: 'JOB_NOT_FOUND' };
    }

    if (jobRow.status !== 'PROCESSING') {
      return { claimed: false, reason: 'JOB_NOT_PROCESSING' };
    }

    return await this.prisma.$transaction(async (tx) => {
      // Find the first PENDING batch for this job, ordered by batchIndex
      const pendingBatch = await tx.batchactionsBatch.findFirst({
        where: { jobId, status: 'PENDING' },
        orderBy: { batchIndex: 'asc' },
      });

      if (!pendingBatch) {
        return { claimed: false as const, reason: 'NO_PENDING_BATCHES' as const };
      }

      const now = Date.now();

      // Optimistic lock: update only if version matches
      const result = await tx.batchactionsBatch.updateMany({
        where: {
          id: pendingBatch.id,
          version: pendingBatch.version,
        },
        data: {
          status: 'PROCESSING',
          workerId,
          claimedAt: BigInt(now),
          version: pendingBatch.version + 1,
        },
      });

      if (result.count === 0) {
        // Race condition: another worker claimed it first
        return { claimed: false as const, reason: 'NO_PENDING_BATCHES' as const };
      }

      // Also update the JSON batches in the job row for consistency
      const jobBatches = parseJson(jobRow.batches) as Array<{
        id: string;
        status: string;
        processedCount: number;
        failedCount: number;
      }>;
      const updatedBatches = jobBatches.map((b) => (b.id === pendingBatch.id ? { ...b, status: 'PROCESSING' } : b));
      await tx.batchactionsJob.update({
        where: { id: jobId },
        data: { batches: JSON.stringify(updatedBatches) },
      });

      return {
        claimed: true as const,
        reservation: {
          jobId,
          batchId: pendingBatch.id,
          batchIndex: pendingBatch.batchIndex,
          workerId,
          claimedAt: now,
          recordStartIndex: pendingBatch.recordStartIndex,
          recordEndIndex: pendingBatch.recordEndIndex,
        },
      };
    });
  }

  async releaseBatch(jobId: string, batchId: string, workerId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const batch = await tx.batchactionsBatch.findFirst({
        where: { id: batchId, jobId, workerId },
      });

      if (!batch) return;

      await tx.batchactionsBatch.updateMany({
        where: { id: batchId, version: batch.version },
        data: {
          status: 'PENDING',
          workerId: null,
          claimedAt: null,
          version: batch.version + 1,
        },
      });

      // Update job batches JSON for consistency
      const jobRow = await tx.batchactionsJob.findUnique({ where: { id: jobId } });
      if (jobRow) {
        const jobBatches = parseJson(jobRow.batches) as Array<{ id: string; status: string }>;
        const updatedBatches = jobBatches.map((b) => (b.id === batchId ? { ...b, status: 'PENDING' } : b));
        await tx.batchactionsJob.update({
          where: { id: jobId },
          data: { batches: JSON.stringify(updatedBatches) },
        });
      }
    });
  }

  async reclaimStaleBatches(jobId: string, timeoutMs: number): Promise<number> {
    const cutoff = BigInt(Date.now() - timeoutMs);

    return await this.prisma.$transaction(async (tx) => {
      const staleBatches = await tx.batchactionsBatch.findMany({
        where: {
          jobId,
          status: 'PROCESSING',
          claimedAt: { lt: cutoff },
        },
      });

      if (staleBatches.length === 0) return 0;

      let reclaimed = 0;
      for (const batch of staleBatches) {
        const result = await tx.batchactionsBatch.updateMany({
          where: { id: batch.id, version: batch.version },
          data: {
            status: 'PENDING',
            workerId: null,
            claimedAt: null,
            version: batch.version + 1,
          },
        });
        reclaimed += result.count;
      }

      // Update job batches JSON for consistency
      if (reclaimed > 0) {
        const reclaimedIds = new Set(staleBatches.map((b) => b.id));
        const jobRow = await tx.batchactionsJob.findUnique({ where: { id: jobId } });
        if (jobRow) {
          const jobBatches = parseJson(jobRow.batches) as Array<{ id: string; status: string }>;
          const updatedBatches = jobBatches.map((b) => (reclaimedIds.has(b.id) ? { ...b, status: 'PENDING' } : b));
          await tx.batchactionsJob.update({
            where: { id: jobId },
            data: { batches: JSON.stringify(updatedBatches) },
          });
        }
      }

      return reclaimed;
    });
  }

  async saveBatchRecords(jobId: string, batchId: string, records: readonly ProcessedRecord[]): Promise<void> {
    const rows = records.map((r) => RecordMapper.toRow(jobId, batchId, r));
    await this.prisma.batchactionsRecord.createMany({ data: rows });
  }

  async getBatchRecords(jobId: string, batchId: string): Promise<readonly ProcessedRecord[]> {
    const rows = await this.prisma.batchactionsRecord.findMany({
      where: { jobId, batchId },
      orderBy: { recordIndex: 'asc' },
    });
    return rows.map((r) => RecordMapper.toDomain(r));
  }

  async getDistributedStatus(jobId: string): Promise<DistributedJobStatus> {
    const counts = (await this.prisma.batchactionsBatch.groupBy({
      by: ['status'],
      where: { jobId },
      _count: { status: true },
    })) as Array<{ status: string; _count: { status: number } }>;

    const countMap = new Map<string, number>();
    let total = 0;
    for (const row of counts) {
      const count = row._count.status;
      countMap.set(row.status, count);
      total += count;
    }

    const completed = countMap.get('COMPLETED') ?? 0;
    const failed = countMap.get('FAILED') ?? 0;
    const processing = countMap.get('PROCESSING') ?? 0;
    const pending = countMap.get('PENDING') ?? 0;

    return {
      jobId,
      totalBatches: total,
      completedBatches: completed,
      failedBatches: failed,
      processingBatches: processing,
      pendingBatches: pending,
      isComplete: total > 0 && pending === 0 && processing === 0,
    };
  }

  async tryFinalizeJob(jobId: string): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      const jobRow = await tx.batchactionsJob.findUnique({ where: { id: jobId } });
      if (!jobRow) return false;

      if (jobRow.status !== 'PROCESSING') return false;

      // Check if all batches are in terminal state
      const status = await this.getDistributedStatusInTransaction(jobId, tx);
      if (!status.isComplete) return false;

      // Determine final status: FAILED if any batch failed, COMPLETED otherwise
      const finalStatus = status.failedBatches > 0 ? 'FAILED' : 'COMPLETED';

      // Atomic update: only transition if still PROCESSING
      const result = await tx.batchactionsJob.updateMany({
        where: { id: jobId, status: 'PROCESSING' },
        data: {
          status: finalStatus,
          completedAt: BigInt(Date.now()),
        },
      });

      return result.count > 0;
    });
  }

  /**
   * Internal helper to get distributed status within an existing transaction.
   */
  private async getDistributedStatusInTransaction(
    jobId: string,
    tx: PrismaBatchactionsClient,
  ): Promise<DistributedJobStatus> {
    const counts = (await tx.batchactionsBatch.groupBy({
      by: ['status'],
      where: { jobId },
      _count: { status: true },
    })) as Array<{ status: string; _count: { status: number } }>;

    const countMap = new Map<string, number>();
    let total = 0;
    for (const row of counts) {
      const count = row._count.status;
      countMap.set(row.status, count);
      total += count;
    }

    const completed = countMap.get('COMPLETED') ?? 0;
    const failed = countMap.get('FAILED') ?? 0;
    const processing = countMap.get('PROCESSING') ?? 0;
    const pending = countMap.get('PENDING') ?? 0;

    return {
      jobId,
      totalBatches: total,
      completedBatches: completed,
      failedBatches: failed,
      processingBatches: processing,
      pendingBatches: pending,
      isComplete: total > 0 && pending === 0 && processing === 0,
    };
  }
}
