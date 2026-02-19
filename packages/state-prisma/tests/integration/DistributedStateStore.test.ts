/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaStateStore } from '../../src/PrismaStateStore.js';
import { createTestClient, type TestClientResult } from '../helpers/prisma-test-client.js';
import type { JobState, ProcessedRecord } from '@batchactions/core';

let testClient: TestClientResult;
let store: PrismaStateStore;

function createRecord(overrides: Partial<ProcessedRecord> = {}): ProcessedRecord {
  return {
    index: 0,
    raw: { email: 'test@example.com' },
    parsed: { email: 'test@example.com' },
    status: 'processed',
    errors: [],
    ...overrides,
  };
}

async function setupDistributedJob(
  batchCount = 3,
  recordsPerBatch = 3,
): Promise<{ jobId: string; batchIds: string[] }> {
  const jobId = `job-${String(Date.now())}-${Math.random().toString(36).slice(2)}`;
  const batchIds: string[] = [];

  const batchesForJob: Array<{
    id: string;
    index: number;
    status: string;
    records: never[];
    processedCount: number;
    failedCount: number;
  }> = [];

  for (let i = 0; i < batchCount; i++) {
    const batchId = `batch-${String(i)}`;
    batchIds.push(batchId);
    batchesForJob.push({
      id: batchId,
      index: i,
      status: 'PENDING',
      records: [],
      processedCount: 0,
      failedCount: 0,
    });
  }

  const job: JobState = {
    id: jobId,
    status: 'PROCESSING',
    config: { batchSize: recordsPerBatch },
    batches: batchesForJob,
    totalRecords: batchCount * recordsPerBatch,
    startedAt: Date.now(),
    distributed: true,
  };

  await store.saveJobState(job);

  // Insert batch rows directly via the raw Prisma client
  for (let i = 0; i < batchCount; i++) {
    const startIdx = i * recordsPerBatch;
    await testClient.rawPrisma.batchactionsBatch.create({
      data: {
        id: batchIds[i],
        jobId,
        batchIndex: i,
        status: 'PENDING',
        recordStartIndex: startIdx,
        recordEndIndex: startIdx + recordsPerBatch - 1,
        processedCount: 0,
        failedCount: 0,
        version: 0,
      },
    });
  }

  return { jobId, batchIds };
}

beforeEach(() => {
  testClient = createTestClient();
  store = new PrismaStateStore(testClient.prisma);
});

afterEach(async () => {
  await testClient.cleanup();
});

describe('DistributedStateStore (Prisma)', () => {
  describe('claimBatch', () => {
    it('should claim the first PENDING batch', async () => {
      const { jobId } = await setupDistributedJob();

      const result = await store.claimBatch(jobId, 'worker-1');

      expect(result.claimed).toBe(true);
      if (result.claimed) {
        expect(result.reservation.batchIndex).toBe(0);
        expect(result.reservation.workerId).toBe('worker-1');
        expect(result.reservation.jobId).toBe(jobId);
      }
    });

    it('should return JOB_NOT_FOUND for non-existent job', async () => {
      const result = await store.claimBatch('non-existent', 'worker-1');

      expect(result.claimed).toBe(false);
      if (!result.claimed) {
        expect(result.reason).toBe('JOB_NOT_FOUND');
      }
    });

    it('should return JOB_NOT_PROCESSING for a completed job', async () => {
      const { jobId } = await setupDistributedJob();

      await store.saveJobState({
        id: jobId,
        status: 'COMPLETED',
        config: { batchSize: 3 },
        batches: [],
        totalRecords: 9,
        completedAt: Date.now(),
      });

      const result = await store.claimBatch(jobId, 'worker-1');

      expect(result.claimed).toBe(false);
      if (!result.claimed) {
        expect(result.reason).toBe('JOB_NOT_PROCESSING');
      }
    });

    it('should return NO_PENDING_BATCHES when all are claimed', async () => {
      const { jobId } = await setupDistributedJob(1);

      await store.claimBatch(jobId, 'worker-1');
      const result = await store.claimBatch(jobId, 'worker-2');

      expect(result.claimed).toBe(false);
      if (!result.claimed) {
        expect(result.reason).toBe('NO_PENDING_BATCHES');
      }
    });

    it('should claim different batches for different workers', async () => {
      const { jobId } = await setupDistributedJob(3);

      const r1 = await store.claimBatch(jobId, 'worker-1');
      const r2 = await store.claimBatch(jobId, 'worker-2');
      const r3 = await store.claimBatch(jobId, 'worker-3');

      expect(r1.claimed).toBe(true);
      expect(r2.claimed).toBe(true);
      expect(r3.claimed).toBe(true);

      if (r1.claimed && r2.claimed && r3.claimed) {
        const indices = [r1.reservation.batchIndex, r2.reservation.batchIndex, r3.reservation.batchIndex];
        expect(new Set(indices).size).toBe(3);
      }
    });
  });

  describe('releaseBatch', () => {
    it('should release a claimed batch back to PENDING', async () => {
      const { jobId } = await setupDistributedJob(2);

      const claim = await store.claimBatch(jobId, 'worker-1');
      expect(claim.claimed).toBe(true);

      if (claim.claimed) {
        await store.releaseBatch(jobId, claim.reservation.batchId, 'worker-1');
      }

      const reClaim = await store.claimBatch(jobId, 'worker-2');
      expect(reClaim.claimed).toBe(true);
      if (reClaim.claimed) {
        expect(reClaim.reservation.batchIndex).toBe(0);
      }
    });

    it('should not release if workerId does not match', async () => {
      const { jobId } = await setupDistributedJob(1);

      const claim = await store.claimBatch(jobId, 'worker-1');
      expect(claim.claimed).toBe(true);

      if (claim.claimed) {
        await store.releaseBatch(jobId, claim.reservation.batchId, 'wrong-worker');
      }

      const result = await store.claimBatch(jobId, 'worker-2');
      expect(result.claimed).toBe(false);
    });
  });

  describe('reclaimStaleBatches', () => {
    it('should reclaim batches past timeout', async () => {
      const { jobId, batchIds } = await setupDistributedJob(2);

      await store.claimBatch(jobId, 'worker-1');

      // Manually set claimedAt to the past via raw client
      await testClient.rawPrisma.batchactionsBatch.update({
        where: { id: batchIds[0] },
        data: { claimedAt: BigInt(Date.now() - 60000) },
      });

      const reclaimed = await store.reclaimStaleBatches(jobId, 30000);
      expect(reclaimed).toBe(1);

      const claim = await store.claimBatch(jobId, 'worker-2');
      expect(claim.claimed).toBe(true);
    });

    it('should not reclaim batches within timeout', async () => {
      const { jobId } = await setupDistributedJob(1);

      await store.claimBatch(jobId, 'worker-1');

      const reclaimed = await store.reclaimStaleBatches(jobId, 60000);
      expect(reclaimed).toBe(0);
    });

    it('should return 0 when no processing batches exist', async () => {
      const { jobId } = await setupDistributedJob(1);

      const reclaimed = await store.reclaimStaleBatches(jobId, 30000);
      expect(reclaimed).toBe(0);
    });
  });

  describe('saveBatchRecords + getBatchRecords', () => {
    it('should roundtrip batch records', async () => {
      const { jobId, batchIds } = await setupDistributedJob(1, 3);

      const records: ProcessedRecord[] = [
        createRecord({ index: 0 }),
        createRecord({ index: 1 }),
        createRecord({ index: 2 }),
      ];

      await store.saveBatchRecords(jobId, batchIds[0]!, records);
      const retrieved = await store.getBatchRecords(jobId, batchIds[0]!);

      expect(retrieved).toHaveLength(3);
      expect(retrieved[0]!.index).toBe(0);
      expect(retrieved[2]!.index).toBe(2);
    });

    it('should order by record index', async () => {
      const { jobId, batchIds } = await setupDistributedJob(1, 3);

      const records: ProcessedRecord[] = [
        createRecord({ index: 2 }),
        createRecord({ index: 0 }),
        createRecord({ index: 1 }),
      ];

      await store.saveBatchRecords(jobId, batchIds[0]!, records);
      const retrieved = await store.getBatchRecords(jobId, batchIds[0]!);

      expect(retrieved.map((r) => r.index)).toEqual([0, 1, 2]);
    });

    it('should not return records from other batches', async () => {
      const { jobId, batchIds } = await setupDistributedJob(2, 2);

      await store.saveBatchRecords(jobId, batchIds[0]!, [createRecord({ index: 0 }), createRecord({ index: 1 })]);
      await store.saveBatchRecords(jobId, batchIds[1]!, [createRecord({ index: 2 }), createRecord({ index: 3 })]);

      const batch0Records = await store.getBatchRecords(jobId, batchIds[0]!);
      const batch1Records = await store.getBatchRecords(jobId, batchIds[1]!);

      expect(batch0Records).toHaveLength(2);
      expect(batch1Records).toHaveLength(2);
      expect(batch0Records.map((r) => r.index)).toEqual([0, 1]);
      expect(batch1Records.map((r) => r.index)).toEqual([2, 3]);
    });
  });

  describe('getDistributedStatus', () => {
    it('should aggregate batch statuses correctly', async () => {
      const { jobId, batchIds } = await setupDistributedJob(3);

      await store.claimBatch(jobId, 'worker-1');
      await testClient.rawPrisma.batchactionsBatch.update({
        where: { id: batchIds[0] },
        data: { status: 'COMPLETED' },
      });

      const status = await store.getDistributedStatus(jobId);

      expect(status.totalBatches).toBe(3);
      expect(status.completedBatches).toBe(1);
      expect(status.pendingBatches).toBe(2);
      expect(status.isComplete).toBe(false);
    });

    it('should report isComplete when all batches are terminal', async () => {
      const { jobId, batchIds } = await setupDistributedJob(2);

      await testClient.rawPrisma.batchactionsBatch.update({
        where: { id: batchIds[0] },
        data: { status: 'COMPLETED' },
      });
      await testClient.rawPrisma.batchactionsBatch.update({
        where: { id: batchIds[1] },
        data: { status: 'COMPLETED' },
      });

      const status = await store.getDistributedStatus(jobId);

      expect(status.isComplete).toBe(true);
      expect(status.completedBatches).toBe(2);
    });

    it('should report isComplete with mixed COMPLETED and FAILED', async () => {
      const { jobId, batchIds } = await setupDistributedJob(2);

      await testClient.rawPrisma.batchactionsBatch.update({
        where: { id: batchIds[0] },
        data: { status: 'COMPLETED' },
      });
      await testClient.rawPrisma.batchactionsBatch.update({
        where: { id: batchIds[1] },
        data: { status: 'FAILED' },
      });

      const status = await store.getDistributedStatus(jobId);

      expect(status.isComplete).toBe(true);
      expect(status.failedBatches).toBe(1);
    });

    it('should return all zeros for non-existent job', async () => {
      const status = await store.getDistributedStatus('non-existent');

      expect(status.totalBatches).toBe(0);
      expect(status.isComplete).toBe(false);
    });
  });

  describe('tryFinalizeJob', () => {
    it('should finalize when all batches are complete', async () => {
      const { jobId, batchIds } = await setupDistributedJob(2);

      for (const id of batchIds) {
        await testClient.rawPrisma.batchactionsBatch.update({
          where: { id },
          data: { status: 'COMPLETED' },
        });
      }

      const finalized = await store.tryFinalizeJob(jobId);
      expect(finalized).toBe(true);

      const job = await store.getJobState(jobId);
      expect(job!.status).toBe('COMPLETED');
      expect(job!.completedAt).toBeDefined();
    });

    it('should set FAILED status if any batch failed', async () => {
      const { jobId, batchIds } = await setupDistributedJob(2);

      await testClient.rawPrisma.batchactionsBatch.update({
        where: { id: batchIds[0] },
        data: { status: 'COMPLETED' },
      });
      await testClient.rawPrisma.batchactionsBatch.update({
        where: { id: batchIds[1] },
        data: { status: 'FAILED' },
      });

      const finalized = await store.tryFinalizeJob(jobId);
      expect(finalized).toBe(true);

      const job = await store.getJobState(jobId);
      expect(job!.status).toBe('FAILED');
    });

    it('should return false when batches are still pending', async () => {
      const { jobId } = await setupDistributedJob(2);

      const finalized = await store.tryFinalizeJob(jobId);
      expect(finalized).toBe(false);
    });

    it('should return false for non-existent job', async () => {
      const finalized = await store.tryFinalizeJob('non-existent');
      expect(finalized).toBe(false);
    });

    it('should ensure exactly-once finalization', async () => {
      const { jobId, batchIds } = await setupDistributedJob(2);

      for (const id of batchIds) {
        await testClient.rawPrisma.batchactionsBatch.update({
          where: { id },
          data: { status: 'COMPLETED' },
        });
      }

      const r1 = await store.tryFinalizeJob(jobId);
      const r2 = await store.tryFinalizeJob(jobId);
      const r3 = await store.tryFinalizeJob(jobId);

      const successes = [r1, r2, r3].filter(Boolean);
      expect(successes).toHaveLength(1);
    });
  });

  describe('distributed field on job state', () => {
    it('should persist and restore distributed flag', async () => {
      const job: JobState = {
        id: 'dist-job-1',
        status: 'PROCESSING',
        config: { batchSize: 10 },
        batches: [],
        totalRecords: 30,
        distributed: true,
      };

      await store.saveJobState(job);
      const retrieved = await store.getJobState(job.id);

      expect(retrieved!.distributed).toBe(true);
    });

    it('should default to false when not set', async () => {
      const job: JobState = {
        id: 'non-dist-job',
        status: 'PROCESSING',
        config: { batchSize: 10 },
        batches: [],
        totalRecords: 0,
      };

      await store.saveJobState(job);
      const retrieved = await store.getJobState(job.id);

      expect(retrieved!.distributed).toBeUndefined();
    });
  });

  describe('full distributed flow', () => {
    it('should complete the full prepare → claim → process → finalize cycle', async () => {
      const { jobId, batchIds } = await setupDistributedJob(3, 3);

      for (let i = 0; i < 3; i++) {
        const claim = await store.claimBatch(jobId, `worker-${String(i)}`);
        expect(claim.claimed).toBe(true);

        if (claim.claimed) {
          const records: ProcessedRecord[] = [];
          for (let j = 0; j < 3; j++) {
            records.push(createRecord({ index: i * 3 + j, status: 'processed' }));
          }
          await store.saveBatchRecords(jobId, claim.reservation.batchId, records);

          await store.updateBatchState(jobId, claim.reservation.batchId, {
            batchId: claim.reservation.batchId,
            status: 'COMPLETED',
            processedCount: 3,
            failedCount: 0,
          });
        }
      }

      // Update batch table directly
      for (const id of batchIds) {
        await testClient.rawPrisma.batchactionsBatch.update({
          where: { id },
          data: { status: 'COMPLETED', processedCount: 3 },
        });
      }

      const finalized = await store.tryFinalizeJob(jobId);
      expect(finalized).toBe(true);

      const job = await store.getJobState(jobId);
      expect(job!.status).toBe('COMPLETED');

      const allRecords = await store.getProcessedRecords(jobId);
      expect(allRecords).toHaveLength(9);

      const progress = await store.getProgress(jobId);
      expect(progress.processedRecords).toBe(9);
      expect(progress.percentage).toBe(100);
    });
  });
});
