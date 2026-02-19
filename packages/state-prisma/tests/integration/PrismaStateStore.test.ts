import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaStateStore } from '../../src/PrismaStateStore.js';
import { createTestClient, type TestClientResult } from '../helpers/prisma-test-client.js';
import type { JobState, ProcessedRecord } from '@batchactions/core';

let testClient: TestClientResult;
let store: PrismaStateStore;

function createJobState(overrides: Partial<JobState> = {}): JobState {
  return {
    id: `job-${String(Date.now())}-${Math.random().toString(36).slice(2)}`,
    status: 'PROCESSING',
    config: { batchSize: 100 },
    batches: [],
    totalRecords: 0,
    ...overrides,
  };
}

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

beforeEach(() => {
  testClient = createTestClient();
  store = new PrismaStateStore(testClient.prisma);
});

afterEach(async () => {
  await testClient.cleanup();
});

describe('PrismaStateStore', () => {
  describe('saveJobState + getJobState', () => {
    it('should persist and retrieve a job state', async () => {
      const job = createJobState({ totalRecords: 50, startedAt: Date.now() });

      await store.saveJobState(job);
      const retrieved = await store.getJobState(job.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(job.id);
      expect(retrieved!.status).toBe('PROCESSING');
      expect(retrieved!.totalRecords).toBe(50);
      expect(retrieved!.startedAt).toBe(job.startedAt);
    });

    it('should return null for a missing job', async () => {
      const result = await store.getJobState('non-existent');
      expect(result).toBeNull();
    });

    it('should upsert on second save', async () => {
      const job = createJobState();
      await store.saveJobState(job);

      const updated: JobState = { ...job, status: 'COMPLETED', completedAt: Date.now() };
      await store.saveJobState(updated);

      const retrieved = await store.getJobState(job.id);
      expect(retrieved!.status).toBe('COMPLETED');
      expect(retrieved!.completedAt).toBe(updated.completedAt);
    });

    it('should preserve schema config', async () => {
      const job = createJobState({
        config: {
          batchSize: 50,
          schema: {
            fields: [
              { name: 'email', type: 'email', required: true },
              { name: 'name', type: 'string', required: false },
            ],
          },
        },
      });

      await store.saveJobState(job);
      const retrieved = await store.getJobState(job.id);

      const schema = retrieved!.config.schema as { fields: Array<Record<string, unknown>> };
      expect(schema.fields).toHaveLength(2);
      expect(schema.fields[0]).toHaveProperty('name', 'email');
      expect(schema.fields[1]).toHaveProperty('name', 'name');
    });
  });

  describe('updateBatchState', () => {
    it('should update a specific batch status', async () => {
      const job = createJobState({
        batches: [
          { id: 'b1', index: 0, status: 'PENDING', records: [], processedCount: 0, failedCount: 0 },
          { id: 'b2', index: 1, status: 'PENDING', records: [], processedCount: 0, failedCount: 0 },
        ],
      });
      await store.saveJobState(job);

      await store.updateBatchState(job.id, 'b1', {
        batchId: 'b1',
        status: 'COMPLETED',
        processedCount: 10,
        failedCount: 2,
      });

      const retrieved = await store.getJobState(job.id);
      const batches = retrieved!.batches as Array<{ id: string; status: string; processedCount: number }>;

      expect(batches[0]!.status).toBe('COMPLETED');
      expect(batches[0]!.processedCount).toBe(10);
      expect(batches[1]!.status).toBe('PENDING');
    });

    it('should not throw for a missing job', async () => {
      await expect(
        store.updateBatchState('non-existent', 'b1', {
          batchId: 'b1',
          status: 'COMPLETED',
          processedCount: 0,
          failedCount: 0,
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe('saveProcessedRecord', () => {
    it('should save a record', async () => {
      const job = createJobState({ totalRecords: 1 });
      await store.saveJobState(job);

      const record = createRecord({ index: 0 });
      await store.saveProcessedRecord(job.id, 'batch-1', record);

      const records = await store.getProcessedRecords(job.id);
      expect(records).toHaveLength(1);
      expect(records[0]!.raw).toEqual({ email: 'test@example.com' });
    });

    it('should upsert on duplicate jobId + recordIndex', async () => {
      const job = createJobState({ totalRecords: 1 });
      await store.saveJobState(job);

      const record = createRecord({ index: 0, status: 'pending' });
      await store.saveProcessedRecord(job.id, 'batch-1', record);

      const updated = createRecord({ index: 0, status: 'processed' });
      await store.saveProcessedRecord(job.id, 'batch-1', updated);

      const records = await store.getProcessedRecords(job.id);
      expect(records).toHaveLength(1);
      expect(records[0]!.status).toBe('processed');
    });
  });

  describe('getFailedRecords', () => {
    it('should return failed and invalid records', async () => {
      const job = createJobState({ totalRecords: 3 });
      await store.saveJobState(job);

      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 0, status: 'processed' }));
      await store.saveProcessedRecord(
        job.id,
        'b1',
        createRecord({ index: 1, status: 'failed', processingError: 'err' }),
      );
      await store.saveProcessedRecord(
        job.id,
        'b1',
        createRecord({
          index: 2,
          status: 'invalid',
          errors: [{ field: 'x', message: 'bad', severity: 'error', category: 'format' }],
        }),
      );

      const failed = await store.getFailedRecords(job.id);
      expect(failed).toHaveLength(2);
      expect(failed.map((r) => r.status)).toEqual(['failed', 'invalid']);
    });

    it('should return empty array when no failures', async () => {
      const job = createJobState();
      await store.saveJobState(job);

      const failed = await store.getFailedRecords(job.id);
      expect(failed).toHaveLength(0);
    });
  });

  describe('getPendingRecords', () => {
    it('should return pending and valid records', async () => {
      const job = createJobState({ totalRecords: 3 });
      await store.saveJobState(job);

      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 0, status: 'pending' }));
      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 1, status: 'valid' }));
      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 2, status: 'processed' }));

      const pending = await store.getPendingRecords(job.id);
      expect(pending).toHaveLength(2);
      expect(pending.map((r) => r.status)).toEqual(['pending', 'valid']);
    });
  });

  describe('getProcessedRecords', () => {
    it('should return only processed records', async () => {
      const job = createJobState({ totalRecords: 3 });
      await store.saveJobState(job);

      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 0, status: 'processed' }));
      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 1, status: 'failed' }));
      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 2, status: 'processed' }));

      const records = await store.getProcessedRecords(job.id);
      expect(records).toHaveLength(2);
      expect(records.every((r) => r.status === 'processed')).toBe(true);
    });

    it('should order by record index', async () => {
      const job = createJobState({ totalRecords: 3 });
      await store.saveJobState(job);

      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 2, status: 'processed' }));
      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 0, status: 'processed' }));
      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 1, status: 'processed' }));

      const records = await store.getProcessedRecords(job.id);
      expect(records.map((r) => r.index)).toEqual([0, 1, 2]);
    });
  });

  describe('getProgress', () => {
    it('should calculate progress from stored records', async () => {
      const job = createJobState({ totalRecords: 5, startedAt: Date.now() - 1000 });
      await store.saveJobState(job);

      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 0, status: 'processed' }));
      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 1, status: 'processed' }));
      await store.saveProcessedRecord(job.id, 'b1', createRecord({ index: 2, status: 'failed' }));

      const progress = await store.getProgress(job.id);

      expect(progress.totalRecords).toBe(5);
      expect(progress.processedRecords).toBe(2);
      expect(progress.failedRecords).toBe(1);
      expect(progress.pendingRecords).toBe(2);
      expect(progress.percentage).toBe(60);
      expect(progress.elapsedMs).toBeGreaterThan(0);
    });

    it('should return zero progress for a missing job', async () => {
      const progress = await store.getProgress('non-existent');

      expect(progress.totalRecords).toBe(0);
      expect(progress.processedRecords).toBe(0);
      expect(progress.percentage).toBe(0);
    });

    it('should count completed batches', async () => {
      const job = createJobState({
        totalRecords: 10,
        batches: [
          { id: 'b1', index: 0, status: 'COMPLETED', records: [], processedCount: 5, failedCount: 0 },
          { id: 'b2', index: 1, status: 'PROCESSING', records: [], processedCount: 0, failedCount: 0 },
        ],
      });
      await store.saveJobState(job);

      const progress = await store.getProgress(job.id);
      expect(progress.currentBatch).toBe(1);
      expect(progress.totalBatches).toBe(2);
    });
  });

  describe('isolation between jobs', () => {
    it('should not mix records between jobs', async () => {
      const job1 = createJobState({ id: 'job-iso-1', totalRecords: 1 });
      const job2 = createJobState({ id: 'job-iso-2', totalRecords: 1 });
      await store.saveJobState(job1);
      await store.saveJobState(job2);

      await store.saveProcessedRecord('job-iso-1', 'b1', createRecord({ index: 0, status: 'processed' }));
      await store.saveProcessedRecord('job-iso-2', 'b1', createRecord({ index: 0, status: 'failed' }));

      const records1 = await store.getProcessedRecords('job-iso-1');
      const failed2 = await store.getFailedRecords('job-iso-2');

      expect(records1).toHaveLength(1);
      expect(records1[0]!.status).toBe('processed');
      expect(failed2).toHaveLength(1);
      expect(failed2[0]!.status).toBe('failed');
    });
  });
});
