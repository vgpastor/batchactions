import { describe, it, expect, beforeEach } from 'vitest';
import type {
  DistributedStateStore,
  ClaimBatchResult,
  DistributedJobStatus,
  BatchReservation,
  ProcessedRecord,
  JobState,
  JobProgress,
  BatchState,
} from '@batchactions/core';
import { BufferSource } from '@batchactions/core';
import { CsvParser } from '@batchactions/import';
import { DistributedImport } from '../src/DistributedImport.js';
import type { DistributedImportConfig } from '../src/DistributedImport.js';

// ============================================================
// Mock DistributedStateStore (reused from main test file)
// ============================================================

class MockDistributedStateStore implements DistributedStateStore {
  jobs = new Map<string, JobState>();
  records = new Map<string, Map<string, ProcessedRecord[]>>();
  batchClaims = new Map<string, { status: string; workerId?: string; claimedAt?: number }[]>();
  finalized = new Set<string>();

  async saveJobState(job: JobState): Promise<void> {
    this.jobs.set(job.id, job);
    if (!this.batchClaims.has(job.id)) {
      this.batchClaims.set(
        job.id,
        job.batches.map((b) => ({
          status: b.status,
          workerId: b.workerId,
          claimedAt: b.claimedAt,
        })),
      );
    }
  }

  async getJobState(jobId: string): Promise<JobState | null> {
    return this.jobs.get(jobId) ?? null;
  }

  async updateBatchState(jobId: string, batchId: string, state: BatchState): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;
    const batches = job.batches.map((b) =>
      b.id === batchId
        ? { ...b, status: state.status, processedCount: state.processedCount, failedCount: state.failedCount }
        : b,
    );
    this.jobs.set(jobId, { ...job, batches });

    const claims = this.batchClaims.get(jobId);
    if (claims) {
      const batchIndex = job.batches.findIndex((b) => b.id === batchId);
      if (batchIndex >= 0 && claims[batchIndex]) {
        claims[batchIndex]!.status = state.status;
      }
    }
  }

  async saveProcessedRecord(jobId: string, batchId: string, record: ProcessedRecord): Promise<void> {
    if (!this.records.has(jobId)) this.records.set(jobId, new Map());
    const jobRecords = this.records.get(jobId)!;
    if (!jobRecords.has(batchId)) jobRecords.set(batchId, []);
    const batchRecords = jobRecords.get(batchId)!;
    const existingIdx = batchRecords.findIndex((r) => r.index === record.index);
    if (existingIdx >= 0) {
      batchRecords[existingIdx] = record;
    } else {
      batchRecords.push(record);
    }
  }

  async getFailedRecords(jobId: string): Promise<readonly ProcessedRecord[]> {
    const jobRecords = this.records.get(jobId);
    if (!jobRecords) return [];
    const all: ProcessedRecord[] = [];
    for (const batchRecords of jobRecords.values()) {
      all.push(...batchRecords.filter((r) => r.status === 'failed' || r.status === 'invalid'));
    }
    return all;
  }

  async getPendingRecords(_jobId: string): Promise<readonly ProcessedRecord[]> {
    return [];
  }

  async getProcessedRecords(jobId: string): Promise<readonly ProcessedRecord[]> {
    const jobRecords = this.records.get(jobId);
    if (!jobRecords) return [];
    const all: ProcessedRecord[] = [];
    for (const batchRecords of jobRecords.values()) {
      all.push(...batchRecords.filter((r) => r.status === 'processed'));
    }
    return all;
  }

  async getProgress(_jobId: string): Promise<JobProgress> {
    return {
      totalRecords: 0,
      processedRecords: 0,
      failedRecords: 0,
      pendingRecords: 0,
      percentage: 0,
      currentBatch: 0,
      totalBatches: 0,
      elapsedMs: 0,
    };
  }

  async claimBatch(jobId: string, workerId: string): Promise<ClaimBatchResult> {
    const job = this.jobs.get(jobId);
    if (!job) return { claimed: false, reason: 'JOB_NOT_FOUND' };
    if (job.status !== 'PROCESSING') return { claimed: false, reason: 'JOB_NOT_PROCESSING' };

    const claims = this.batchClaims.get(jobId) ?? [];
    const pendingIdx = claims.findIndex((c) => c.status === 'PENDING');
    if (pendingIdx < 0) return { claimed: false, reason: 'NO_PENDING_BATCHES' };

    const batch = job.batches[pendingIdx];
    if (!batch) return { claimed: false, reason: 'NO_PENDING_BATCHES' };

    claims[pendingIdx] = { status: 'PROCESSING', workerId, claimedAt: Date.now() };

    const updatedBatches = job.batches.map((b, i) =>
      i === pendingIdx ? { ...b, status: 'PROCESSING' as const, workerId, claimedAt: Date.now() } : b,
    );
    this.jobs.set(jobId, { ...job, batches: updatedBatches });

    const reservation: BatchReservation = {
      jobId,
      batchId: batch.id,
      batchIndex: batch.index,
      workerId,
      claimedAt: Date.now(),
      recordStartIndex: batch.recordStartIndex ?? 0,
      recordEndIndex: batch.recordEndIndex ?? 0,
    };

    return { claimed: true, reservation };
  }

  async releaseBatch(jobId: string, batchId: string, workerId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;
    const claims = this.batchClaims.get(jobId) ?? [];
    const idx = job.batches.findIndex((b) => b.id === batchId);
    if (idx < 0) return;
    const claim = claims[idx];
    if (claim && claim.workerId === workerId) {
      claim.status = 'PENDING';
      claim.workerId = undefined;
      claim.claimedAt = undefined;
      const updatedBatches = job.batches.map((b, i) =>
        i === idx ? { ...b, status: 'PENDING' as const, workerId: undefined, claimedAt: undefined } : b,
      );
      this.jobs.set(jobId, { ...job, batches: updatedBatches });
    }
  }

  async reclaimStaleBatches(jobId: string, timeoutMs: number): Promise<number> {
    const claims = this.batchClaims.get(jobId) ?? [];
    const job = this.jobs.get(jobId);
    if (!job) return 0;
    let reclaimed = 0;
    const now = Date.now();
    const updatedBatches = [...job.batches];
    for (let i = 0; i < claims.length; i++) {
      const claim = claims[i];
      if (claim && claim.status === 'PROCESSING' && claim.claimedAt && now - claim.claimedAt > timeoutMs) {
        claim.status = 'PENDING';
        claim.workerId = undefined;
        claim.claimedAt = undefined;
        if (updatedBatches[i]) {
          updatedBatches[i] = {
            ...updatedBatches[i]!,
            status: 'PENDING' as const,
            workerId: undefined,
            claimedAt: undefined,
          };
        }
        reclaimed++;
      }
    }
    if (reclaimed > 0) {
      this.jobs.set(jobId, { ...job, batches: updatedBatches });
    }
    return reclaimed;
  }

  async saveBatchRecords(jobId: string, batchId: string, records: readonly ProcessedRecord[]): Promise<void> {
    if (!this.records.has(jobId)) this.records.set(jobId, new Map());
    const jobRecords = this.records.get(jobId)!;
    jobRecords.set(batchId, [...records]);
  }

  async getBatchRecords(jobId: string, batchId: string): Promise<readonly ProcessedRecord[]> {
    const jobRecords = this.records.get(jobId);
    if (!jobRecords) return [];
    return jobRecords.get(batchId) ?? [];
  }

  async getDistributedStatus(jobId: string): Promise<DistributedJobStatus> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return {
        jobId,
        totalBatches: 0,
        completedBatches: 0,
        failedBatches: 0,
        processingBatches: 0,
        pendingBatches: 0,
        isComplete: false,
      };
    }
    const claims = this.batchClaims.get(jobId) ?? [];
    const completed = claims.filter((c) => c.status === 'COMPLETED').length;
    const failed = claims.filter((c) => c.status === 'FAILED').length;
    const processing = claims.filter((c) => c.status === 'PROCESSING').length;
    const pending = claims.filter((c) => c.status === 'PENDING').length;
    return {
      jobId,
      totalBatches: claims.length,
      completedBatches: completed,
      failedBatches: failed,
      processingBatches: processing,
      pendingBatches: pending,
      isComplete: completed + failed === claims.length && claims.length > 0,
    };
  }

  async tryFinalizeJob(jobId: string): Promise<boolean> {
    if (this.finalized.has(jobId)) return false;
    const status = await this.getDistributedStatus(jobId);
    if (status.isComplete) {
      this.finalized.add(jobId);
      const job = this.jobs.get(jobId);
      if (job) {
        this.jobs.set(jobId, { ...job, status: 'COMPLETED' });
      }
      return true;
    }
    return false;
  }
}

// ============================================================
// Helpers
// ============================================================

function generateCsv(count: number, options?: { invalidEveryN?: number }): string {
  const header = 'name,email';
  const rows: string[] = [];
  for (let i = 0; i < count; i++) {
    if (options?.invalidEveryN && (i + 1) % options.invalidEveryN === 0) {
      rows.push(`value${String(i)},not-an-email`);
    } else {
      rows.push(`value${String(i)},user${String(i)}@test.com`);
    }
  }
  return [header, ...rows].join('\n');
}

function createConfig(
  stateStore: MockDistributedStateStore,
  overrides?: Partial<DistributedImportConfig>,
): DistributedImportConfig {
  return {
    schema: {
      fields: [
        { name: 'name', type: 'string', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    batchSize: 5,
    continueOnError: true,
    stateStore,
    ...overrides,
  };
}

// ============================================================
// 1. Prepare phase edge cases
// ============================================================
describe('Prepare phase boundary cases', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should handle single record (1 batch)', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(1);
    const result = await di.prepare(new BufferSource(csv), new CsvParser());

    expect(result.totalRecords).toBe(1);
    expect(result.totalBatches).toBe(1);
  });

  it('should handle exact batch boundary (records = N * batchSize)', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(10); // exactly 2 batches of 5
    const result = await di.prepare(new BufferSource(csv), new CsvParser());

    expect(result.totalRecords).toBe(10);
    expect(result.totalBatches).toBe(2);

    const job = await stateStore.getJobState(result.jobId);
    expect(job!.batches).toHaveLength(2);

    // Verify record index ranges don't overlap
    const batch0 = job!.batches[0]!;
    const batch1 = job!.batches[1]!;
    expect(batch0.recordEndIndex).toBeLessThan(batch1.recordStartIndex!);
  });

  it('should handle records = batchSize + 1 (partial last batch)', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(6); // 1 full batch + 1 partial
    const result = await di.prepare(new BufferSource(csv), new CsvParser());

    expect(result.totalRecords).toBe(6);
    expect(result.totalBatches).toBe(2);

    // Last batch should have 1 record
    const job = await stateStore.getJobState(result.jobId);
    const lastBatch = job!.batches[1]!;
    const lastBatchRecords = await stateStore.getBatchRecords(result.jobId, lastBatch.id);
    expect(lastBatchRecords).toHaveLength(1);
  });

  it('should handle batchSize=1 (every record is its own batch)', async () => {
    const di = new DistributedImport(createConfig(stateStore, { batchSize: 1 }));
    const csv = generateCsv(3);
    const result = await di.prepare(new BufferSource(csv), new CsvParser());

    expect(result.totalRecords).toBe(3);
    expect(result.totalBatches).toBe(3);
  });

  it('should handle batchSize larger than total records', async () => {
    const di = new DistributedImport(createConfig(stateStore, { batchSize: 1000 }));
    const csv = generateCsv(3);
    const result = await di.prepare(new BufferSource(csv), new CsvParser());

    expect(result.totalRecords).toBe(3);
    expect(result.totalBatches).toBe(1);
  });

  it('should set job status to PROCESSING and distributed flag', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(5);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const job = await stateStore.getJobState(jobId);
    expect(job!.status).toBe('PROCESSING');
    expect(job!.distributed).toBe(true);
  });

  it('should materialize all records in the state store', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(12);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const job = await stateStore.getJobState(jobId);
    let totalMaterialized = 0;
    for (const batch of job!.batches) {
      const records = await stateStore.getBatchRecords(jobId, batch.id);
      totalMaterialized += records.length;
    }
    expect(totalMaterialized).toBe(12);
  });

  it('should emit distributed:prepared event with correct counts', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const events: Array<{ totalRecords: number; totalBatches: number }> = [];
    di.on('distributed:prepared', (e) => events.push(e));

    const csv = generateCsv(7);
    await di.prepare(new BufferSource(csv), new CsvParser());

    expect(events).toHaveLength(1);
    expect(events[0]!.totalRecords).toBe(7);
    expect(events[0]!.totalBatches).toBe(2);
  });
});

// ============================================================
// 2. Worker claiming edge cases
// ============================================================
describe('Worker claiming boundary cases', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should return claimed=false for non-existent job', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(1);
    await di.prepare(new BufferSource(csv), new CsvParser());

    const result = await di.processWorkerBatch('non-existent-id', () => {}, 'w1');
    expect(result.claimed).toBe(false);
  });

  it('should process single-record single-batch job', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(1);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const processed: string[] = [];
    const result = await di.processWorkerBatch(
      jobId,
      async (record) => {
        processed.push(String(record['name']));
      },
      'w1',
    );

    expect(result.claimed).toBe(true);
    expect(result.processedCount).toBe(1);
    expect(result.jobComplete).toBe(true);
    expect(processed).toHaveLength(1);
  });

  it('should not allow claiming after job is finalized', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(3);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const r1 = await di.processWorkerBatch(jobId, () => {}, 'w1');
    expect(r1.jobComplete).toBe(true);

    // Second claim should fail
    const r2 = await di.processWorkerBatch(jobId, () => {}, 'w2');
    expect(r2.claimed).toBe(false);
    expect(r2.processedCount).toBe(0);
  });

  it('should allow each batch to be claimed exactly once', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(15); // 3 batches of 5
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const batchIds = new Set<string>();
    for (let i = 0; i < 3; i++) {
      const r = await di.processWorkerBatch(jobId, () => {}, `w${String(i)}`);
      expect(r.claimed).toBe(true);
      expect(batchIds.has(r.batchId!)).toBe(false);
      batchIds.add(r.batchId!);
    }

    expect(batchIds.size).toBe(3);

    // No more batches
    const rFinal = await di.processWorkerBatch(jobId, () => {}, 'w99');
    expect(rFinal.claimed).toBe(false);
  });
});

// ============================================================
// 3. Exactly-once finalization
// ============================================================
describe('Exactly-once finalization', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should emit job:completed exactly once when multiple workers finish', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(10); // 2 batches
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const completionEvents: unknown[] = [];
    di.on('job:completed', (e) => completionEvents.push(e));

    // Two workers process one batch each
    const r1 = await di.processWorkerBatch(jobId, () => {}, 'w1');
    const r2 = await di.processWorkerBatch(jobId, () => {}, 'w2');

    // Exactly one should have jobComplete=true
    const completions = [r1, r2].filter((r) => r.jobComplete);
    expect(completions).toHaveLength(1);

    // Exactly one job:completed event
    expect(completionEvents).toHaveLength(1);
  });

  it('should mark job as COMPLETED after finalization', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(5);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    await di.processWorkerBatch(jobId, () => {}, 'w1');

    const job = await stateStore.getJobState(jobId);
    expect(job!.status).toBe('COMPLETED');
  });

  it('should track distributed status accurately', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(15); // 3 batches
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    // Process 1 of 3 batches
    await di.processWorkerBatch(jobId, () => {}, 'w1');

    const status = await stateStore.getDistributedStatus(jobId);
    expect(status.completedBatches).toBe(1);
    expect(status.pendingBatches).toBe(2);
    expect(status.isComplete).toBe(false);

    // Process remaining batches
    await di.processWorkerBatch(jobId, () => {}, 'w2');
    await di.processWorkerBatch(jobId, () => {}, 'w3');

    const finalStatus = await stateStore.getDistributedStatus(jobId);
    expect(finalStatus.completedBatches).toBe(3);
    expect(finalStatus.pendingBatches).toBe(0);
    expect(finalStatus.isComplete).toBe(true);
  });
});

// ============================================================
// 4. Mixed success/failure across batches
// ============================================================
describe('Mixed success/failure across batches', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should handle all records invalid in one batch but valid in another', async () => {
    // First 5 records have invalid emails, next 5 are valid
    const csv =
      'name,email\nbad1,x\nbad2,y\nbad3,z\nbad4,a\nbad5,b\nok1,ok1@test.com\nok2,ok2@test.com\nok3,ok3@test.com\nok4,ok4@test.com\nok5,ok5@test.com';
    const di = new DistributedImport(createConfig(stateStore));
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const r1 = await di.processWorkerBatch(jobId, () => {}, 'w1');
    expect(r1.failedCount).toBe(5);
    expect(r1.processedCount).toBe(0);

    const r2 = await di.processWorkerBatch(jobId, () => {}, 'w2');
    expect(r2.processedCount).toBe(5);
    expect(r2.failedCount).toBe(0);
    expect(r2.jobComplete).toBe(true);
  });

  it('should handle processor errors with continueOnError=true', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(5);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    let count = 0;
    const processor = async () => {
      count++;
      if (count === 3) throw new Error('Processor error on record 3');
    };

    const result = await di.processWorkerBatch(jobId, processor, 'w1');
    expect(result.processedCount).toBe(4);
    expect(result.failedCount).toBe(1);
    expect(result.jobComplete).toBe(true);
  });

  it('should stop batch processing when continueOnError=false and error occurs', async () => {
    const di = new DistributedImport(createConfig(stateStore, { continueOnError: false }));
    const csv = generateCsv(5);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    let count = 0;
    const processor = async () => {
      count++;
      if (count === 2) throw new Error('Fatal error');
    };

    const result = await di.processWorkerBatch(jobId, processor, 'w1');
    expect(result.processedCount).toBe(1); // Only first record succeeded
    expect(result.failedCount).toBe(1);

    // Check batch is marked as FAILED
    const status = await stateStore.getDistributedStatus(jobId);
    expect(status.failedBatches).toBe(1);
  });

  it('should count failed batches in distributed status', async () => {
    const di = new DistributedImport(createConfig(stateStore, { continueOnError: false }));
    const csv = generateCsv(10); // 2 batches
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    // First batch fails
    let callCount = 0;
    await di.processWorkerBatch(
      jobId,
      async () => {
        callCount++;
        if (callCount === 1) throw new Error('fail');
      },
      'w1',
    );

    // Second batch succeeds
    await di.processWorkerBatch(jobId, () => {}, 'w2');

    const status = await stateStore.getDistributedStatus(jobId);
    expect(status.failedBatches).toBe(1);
    expect(status.completedBatches).toBe(1);
    expect(status.isComplete).toBe(true);
  });
});

// ============================================================
// 5. Recovery: stale batch reclamation
// ============================================================
describe('Stale batch recovery', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should reclaim stale batches and allow reprocessing', async () => {
    const config = createConfig(stateStore, { staleBatchTimeoutMs: 0 });
    const di = new DistributedImport(config);
    const csv = generateCsv(5);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    // Simulate a crashed worker: manually set batch to PROCESSING with old timestamp
    const job = await stateStore.getJobState(jobId);
    const claims = stateStore.batchClaims.get(jobId)!;
    claims[0] = { status: 'PROCESSING', workerId: 'crashed', claimedAt: Date.now() - 10000 };
    const updatedBatches = job!.batches.map((b, i) =>
      i === 0 ? { ...b, status: 'PROCESSING' as const, workerId: 'crashed', claimedAt: Date.now() - 10000 } : b,
    );
    stateStore.jobs.set(jobId, { ...job!, batches: updatedBatches });

    // New worker should reclaim and process
    const result = await di.processWorkerBatch(jobId, () => {}, 'recovery-worker');
    expect(result.claimed).toBe(true);
    expect(result.processedCount).toBe(5);
    expect(result.jobComplete).toBe(true);
  });

  it('should not reclaim batches within timeout window', async () => {
    const config = createConfig(stateStore, { staleBatchTimeoutMs: 60_000 });
    const di = new DistributedImport(config);
    const csv = generateCsv(5);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    // Simulate a worker that just claimed the batch
    const job = await stateStore.getJobState(jobId);
    const claims = stateStore.batchClaims.get(jobId)!;
    claims[0] = { status: 'PROCESSING', workerId: 'active-worker', claimedAt: Date.now() };
    const updatedBatches = job!.batches.map((b, i) =>
      i === 0 ? { ...b, status: 'PROCESSING' as const, workerId: 'active-worker', claimedAt: Date.now() } : b,
    );
    stateStore.jobs.set(jobId, { ...job!, batches: updatedBatches });

    // No pending batches and the processing batch is not stale
    const result = await di.processWorkerBatch(jobId, () => {}, 'other-worker');
    expect(result.claimed).toBe(false);
  });

  it('should reclaim multiple stale batches at once', async () => {
    const config = createConfig(stateStore, { staleBatchTimeoutMs: 0 });
    const di = new DistributedImport(config);
    const csv = generateCsv(15); // 3 batches
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    // Mark all 3 batches as stale
    const job = await stateStore.getJobState(jobId);
    const claims = stateStore.batchClaims.get(jobId)!;
    for (let i = 0; i < 3; i++) {
      claims[i] = { status: 'PROCESSING', workerId: `crashed-${String(i)}`, claimedAt: Date.now() - 10000 };
    }
    const updatedBatches = job!.batches.map((b, i) => ({
      ...b,
      status: 'PROCESSING' as const,
      workerId: `crashed-${String(i)}`,
      claimedAt: Date.now() - 10000,
    }));
    stateStore.jobs.set(jobId, { ...job!, batches: updatedBatches });

    // Recovery worker processes all 3
    const processed: string[] = [];
    for (let i = 0; i < 3; i++) {
      const r = await di.processWorkerBatch(
        jobId,
        async (record) => {
          processed.push(String(record['name']));
        },
        'recovery',
      );
      expect(r.claimed).toBe(true);
    }
    expect(processed).toHaveLength(15);
  });
});

// ============================================================
// 6. Event consistency
// ============================================================
describe('Event consistency in distributed mode', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should emit batch:claimed, batch:started, batch:completed in order for each batch', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(5);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const events: string[] = [];
    di.on('batch:claimed', () => events.push('claimed'));
    di.on('batch:started', () => events.push('started'));
    di.on('batch:completed', () => events.push('completed'));

    await di.processWorkerBatch(jobId, () => {}, 'w1');

    expect(events).toEqual(['claimed', 'started', 'completed']);
  });

  it('should emit record:processed for each successful record', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(5);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const recordEvents: number[] = [];
    di.on('record:processed', (e) => recordEvents.push(e.recordIndex));

    await di.processWorkerBatch(jobId, () => {}, 'w1');

    expect(recordEvents).toHaveLength(5);
    expect(recordEvents).toEqual([0, 1, 2, 3, 4]);
  });

  it('should emit record:failed for invalid records', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(5, { invalidEveryN: 2 }); // records 1,3 invalid (0-based)
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const failedIndices: number[] = [];
    di.on('record:failed', (e) => failedIndices.push(e.recordIndex));

    await di.processWorkerBatch(jobId, () => {}, 'w1');

    expect(failedIndices).toHaveLength(2);
  });

  it('should emit batch:failed when batch fails with continueOnError=false', async () => {
    const di = new DistributedImport(createConfig(stateStore, { continueOnError: false }));
    const csv = generateCsv(5);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const batchFailedEvents: unknown[] = [];
    di.on('batch:failed', (e) => batchFailedEvents.push(e));

    await di.processWorkerBatch(
      jobId,
      async () => {
        throw new Error('fail');
      },
      'w1',
    );

    expect(batchFailedEvents).toHaveLength(1);
  });
});

// ============================================================
// 7. Retry in distributed mode
// ============================================================
describe('Retry in distributed mode', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should retry failed records and emit record:retried events', async () => {
    const config = createConfig(stateStore, { maxRetries: 2, retryDelayMs: 1 });
    const di = new DistributedImport(config);
    const csv = generateCsv(1);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    let attempts = 0;
    const retryEvents: number[] = [];
    di.on('record:retried', (e) => retryEvents.push(e.attempt));

    const result = await di.processWorkerBatch(
      jobId,
      async () => {
        attempts++;
        if (attempts < 3) throw new Error('transient failure');
      },
      'w1',
    );

    expect(result.processedCount).toBe(1);
    expect(retryEvents).toEqual([1, 2]);
  });

  it('should exhaust retries and mark record as failed', async () => {
    const config = createConfig(stateStore, { maxRetries: 2, retryDelayMs: 1 });
    const di = new DistributedImport(config);
    const csv = generateCsv(1);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const result = await di.processWorkerBatch(
      jobId,
      async () => {
        throw new Error('permanent failure');
      },
      'w1',
    );

    expect(result.processedCount).toBe(0);
    expect(result.failedCount).toBe(1);

    const failed = await stateStore.getFailedRecords(jobId);
    expect(failed).toHaveLength(1);
  });
});

// ============================================================
// 8. Hooks in distributed mode
// ============================================================
describe('Hooks boundary cases in distributed mode', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should handle beforeValidate hook failure gracefully', async () => {
    const config = createConfig(stateStore, {
      hooks: {
        beforeValidate: async () => {
          throw new Error('hook error');
        },
      },
    });
    const di = new DistributedImport(config);
    const csv = generateCsv(3);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const result = await di.processWorkerBatch(jobId, () => {}, 'w1');
    expect(result.failedCount).toBe(3);
    expect(result.processedCount).toBe(0);
  });

  it('should handle afterProcess hook failure', async () => {
    const config = createConfig(stateStore, {
      hooks: {
        afterProcess: async () => {
          throw new Error('afterProcess hook failed');
        },
      },
    });
    const di = new DistributedImport(config);
    const csv = generateCsv(2);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const result = await di.processWorkerBatch(jobId, () => {}, 'w1');
    expect(result.failedCount).toBe(2);
    expect(result.processedCount).toBe(0);
  });

  it('should apply beforeProcess hook transformation to processor input', async () => {
    const config = createConfig(stateStore, {
      hooks: {
        beforeProcess: async (data) => ({
          ...data,
          name: `TRANSFORMED_${String(data['name'])}`,
        }),
      },
    });
    const di = new DistributedImport(config);
    const csv = generateCsv(2);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    const names: string[] = [];
    await di.processWorkerBatch(
      jobId,
      async (record) => {
        names.push(String(record['name']));
      },
      'w1',
    );

    expect(names.every((n) => n.startsWith('TRANSFORMED_'))).toBe(true);
  });
});

// ============================================================
// 9. Record persistence correctness
// ============================================================
describe('Record persistence correctness', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should persist all processed records in the state store', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(10);
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    await di.processWorkerBatch(jobId, () => {}, 'w1');
    await di.processWorkerBatch(jobId, () => {}, 'w2');

    const processed = await stateStore.getProcessedRecords(jobId);
    expect(processed).toHaveLength(10);

    // Verify no duplicates
    const indices = processed.map((r) => r.index);
    const uniqueIndices = new Set(indices);
    expect(uniqueIndices.size).toBe(10);
  });

  it('should persist failed records separately from processed', async () => {
    const di = new DistributedImport(createConfig(stateStore));
    const csv = generateCsv(10, { invalidEveryN: 3 }); // records 2,5,8 invalid
    const { jobId } = await di.prepare(new BufferSource(csv), new CsvParser());

    await di.processWorkerBatch(jobId, () => {}, 'w1');
    await di.processWorkerBatch(jobId, () => {}, 'w2');

    const processed = await stateStore.getProcessedRecords(jobId);
    const failed = await stateStore.getFailedRecords(jobId);

    expect(processed.length + failed.length).toBe(10);
    expect(failed.length).toBeGreaterThan(0);

    // No overlap between processed and failed record indices
    const processedIndices = new Set(processed.map((r) => r.index));
    for (const f of failed) {
      expect(processedIndices.has(f.index)).toBe(false);
    }
  });
});

// ============================================================
// 10. Stress test
// ============================================================
describe('Stress: large distributed processing', () => {
  let stateStore: MockDistributedStateStore;

  beforeEach(() => {
    stateStore = new MockDistributedStateStore();
  });

  it('should process 200 records across 20 batches with 4 workers', async () => {
    const config = createConfig(stateStore, { batchSize: 10 });
    const di = new DistributedImport(config);
    const csv = generateCsv(200, { invalidEveryN: 10 });
    const { jobId, totalBatches } = await di.prepare(new BufferSource(csv), new CsvParser());

    expect(totalBatches).toBe(20);

    // 4 workers process in parallel
    const workerResults = new Map<string, number>();
    const workers = ['w1', 'w2', 'w3', 'w4'].map(async (wId) => {
      let processed = 0;
      while (true) {
        const r = await di.processWorkerBatch(jobId, () => {}, wId);
        if (!r.claimed) break;
        processed += r.processedCount + r.failedCount;
        if (r.jobComplete) break;
      }
      workerResults.set(wId, processed);
    });

    await Promise.all(workers);

    // All 200 records accounted for
    const totalProcessed = [...workerResults.values()].reduce((a, b) => a + b, 0);
    expect(totalProcessed).toBe(200);

    // Job finalized
    const job = await stateStore.getJobState(jobId);
    expect(job!.status).toBe('COMPLETED');

    // All records persisted
    const allProcessed = await stateStore.getProcessedRecords(jobId);
    const allFailed = await stateStore.getFailedRecords(jobId);
    expect(allProcessed.length + allFailed.length).toBe(200);
  });
});
