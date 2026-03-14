import { describe, it, expect, afterEach } from 'vitest';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { BatchEngine } from '../../src/BatchEngine.js';
import { BufferSource } from '../../src/infrastructure/sources/BufferSource.js';
import { InMemoryStateStore } from '../../src/infrastructure/state/InMemoryStateStore.js';
import { FileStateStore } from '../../src/infrastructure/state/FileStateStore.js';
import type { RawRecord } from '../../src/domain/model/Record.js';

const TEST_DIR = join(process.cwd(), `.batchactions-test-persistence-${String(process.pid)}`);

function simpleCsvParser() {
  return {
    *parse(data: string | Buffer): Iterable<RawRecord> {
      const text = typeof data === 'string' ? data : data.toString('utf-8');
      const lines = text.split('\n').filter((l) => l.trim() !== '');
      if (lines.length === 0) return;
      const headers = lines[0]!.split(',').map((h) => h.trim());
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i]!.split(',').map((v) => v.trim());
        const record: RawRecord = {};
        for (let j = 0; j < headers.length; j++) {
          record[headers[j]!] = values[j] ?? '';
        }
        yield record;
      }
    },
  };
}

function generateCsv(count: number): string {
  const header = 'email,name,age';
  const rows: string[] = [];
  for (let i = 1; i <= count; i++) {
    rows.push(`user${String(i)}@test.com,User ${String(i)},${String(i * 10)}`);
  }
  return [header, ...rows].join('\n');
}

describe('State persistence and restore', () => {
  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  describe('StateStore integration during processing', () => {
    it('should persist records to StateStore during processing', async () => {
      const stateStore = new InMemoryStateStore();
      const csv = generateCsv(5);

      const engine = new BatchEngine({
        batchSize: 10,
        stateStore,
      });

      engine.from(new BufferSource(csv), simpleCsvParser());

      await engine.start(async () => {
        await Promise.resolve();
      });

      // Records should be persisted in the state store
      const processed = await stateStore.getProcessedRecords(engine.getJobId());
      expect(processed).toHaveLength(5);

      // Job state should be persisted
      const jobState = await stateStore.getJobState(engine.getJobId());
      expect(jobState).not.toBeNull();
      expect(jobState?.status).toBe('COMPLETED');
      expect(jobState?.totalRecords).toBe(5);
    });

    it('should persist failed records to StateStore', async () => {
      const stateStore = new InMemoryStateStore();
      const csv = [
        'email,name,age',
        'valid@test.com,Valid,30',
        'not-email,Invalid,25',
        'also@test.com,Also Valid,20',
      ].join('\n');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const engine = new BatchEngine({
        batchSize: 10,
        continueOnError: true,
        stateStore,
        validate: (record) => {
          const email = (record.email as string | undefined) ?? '';
          if (!emailRegex.test(email)) {
            return {
              isValid: false,
              errors: [{ field: 'email', message: 'Invalid email', code: 'TYPE_MISMATCH' as const }],
            };
          }
          return { isValid: true, errors: [] };
        },
      });

      engine.from(new BufferSource(csv), simpleCsvParser());
      await engine.start(async () => {
        await Promise.resolve();
      });

      const failed = await stateStore.getFailedRecords(engine.getJobId());
      expect(failed).toHaveLength(1);
      expect(failed[0]?.status).toBe('invalid');
    });

    it('should persist state after each batch for crash recovery', async () => {
      const stateStore = new InMemoryStateStore();
      const csv = generateCsv(15);
      let batchesSaved = 0;

      // Spy on saveJobState by wrapping the store
      const originalSave = stateStore.saveJobState.bind(stateStore);
      stateStore.saveJobState = async (job) => {
        batchesSaved++;
        return originalSave(job);
      };

      const engine = new BatchEngine({
        batchSize: 5,
        stateStore,
      });

      engine.from(new BufferSource(csv), simpleCsvParser());
      await engine.start(async () => {
        await Promise.resolve();
      });

      // saveJobState called: once per batch (3) + once at end of start()
      expect(batchesSaved).toBeGreaterThanOrEqual(3);
    });
  });

  describe('BatchEngine.restore()', () => {
    it('should restore a job from persisted state', async () => {
      const stateStore = new InMemoryStateStore();

      // Run a job that completes successfully
      const csv = generateCsv(10);
      const engine = new BatchEngine({
        batchSize: 5,
        stateStore,
      });

      engine.from(new BufferSource(csv), simpleCsvParser());
      await engine.start(async () => {
        await Promise.resolve();
      });

      const jobId = engine.getJobId();

      // Restore from state
      const restored = await BatchEngine.restore(jobId, { stateStore });
      expect(restored).not.toBeNull();
    });

    it('should return null for non-existent job', async () => {
      const stateStore = new InMemoryStateStore();

      const restored = await BatchEngine.restore('non-existent', { stateStore });
      expect(restored).toBeNull();
    });

    it('should skip already-completed batches when re-processing', async () => {
      const stateStore = new InMemoryStateStore();

      // Simulate a partially completed job by saving state directly
      const jobId = 'test-restore-job';
      await stateStore.saveJobState({
        id: jobId,
        config: { batchSize: 5 },
        status: 'FAILED',
        batches: [
          { id: 'b-0', index: 0, status: 'COMPLETED', records: [], processedCount: 5, failedCount: 0 },
          { id: 'b-1', index: 1, status: 'COMPLETED', records: [], processedCount: 5, failedCount: 0 },
        ],
        totalRecords: 15,
        startedAt: Date.now() - 1000,
      });

      // Restore and continue with the same 15-record dataset
      const csv = generateCsv(15);
      const restored = await BatchEngine.restore(jobId, { batchSize: 5, stateStore });
      expect(restored).not.toBeNull();

      restored!.from(new BufferSource(csv), simpleCsvParser());

      const processedInRestore: RawRecord[] = [];
      await restored!.start(async (record) => {
        processedInRestore.push(record);
        await Promise.resolve();
      });

      // Batches 0 and 1 (10 records) were already completed — only batch 2 (5 records) should be processed
      expect(processedInRestore).toHaveLength(5);

      const status = restored!.getStatus();
      expect(status.status).toBe('COMPLETED');
      // Total processed = 10 (restored) + 5 (new) = 15
      expect(status.progress.processedRecords).toBe(15);
    });

    it('should use persisted batchSize even when caller omits it', async () => {
      const stateStore = new InMemoryStateStore();

      // Simulate a partially completed job with batchSize=5
      const jobId = 'test-restore-batchsize';
      await stateStore.saveJobState({
        id: jobId,
        config: { batchSize: 5 },
        status: 'FAILED',
        batches: [{ id: 'b-0', index: 0, status: 'COMPLETED', records: [], processedCount: 5, failedCount: 0 }],
        totalRecords: 10,
        startedAt: Date.now() - 1000,
      });

      // Restore WITHOUT passing batchSize — should use persisted value (5), not default (100)
      const csv = generateCsv(10);
      const restored = await BatchEngine.restore(jobId, { stateStore });
      expect(restored).not.toBeNull();

      restored!.from(new BufferSource(csv), simpleCsvParser());

      const processedInRestore: RawRecord[] = [];
      await restored!.start(async (record) => {
        processedInRestore.push(record);
        await Promise.resolve();
      });

      // Batch 0 (5 records) was completed — only batch 1 (5 records) should be processed
      expect(processedInRestore).toHaveLength(5);

      const status = restored!.getStatus();
      expect(status.status).toBe('COMPLETED');
      expect(status.progress.processedRecords).toBe(10);
      // Should have 2 batches of 5, not 1 batch of 100
      expect(status.progress.totalBatches).toBe(2);
    });

    it('should use persisted batchSize even when caller passes a different value', async () => {
      const stateStore = new InMemoryStateStore();

      // Simulate a partially completed job with batchSize=3
      const jobId = 'test-restore-batchsize-override';
      await stateStore.saveJobState({
        id: jobId,
        config: { batchSize: 3 },
        status: 'FAILED',
        batches: [{ id: 'b-0', index: 0, status: 'COMPLETED', records: [], processedCount: 3, failedCount: 0 }],
        totalRecords: 9,
        startedAt: Date.now() - 1000,
      });

      // Restore with a DIFFERENT batchSize — persisted value (3) should win
      const csv = generateCsv(9);
      const restored = await BatchEngine.restore(jobId, { batchSize: 50, stateStore });
      expect(restored).not.toBeNull();

      restored!.from(new BufferSource(csv), simpleCsvParser());

      const processedInRestore: RawRecord[] = [];
      await restored!.start(async (record) => {
        processedInRestore.push(record);
        await Promise.resolve();
      });

      // Batch 0 (3 records) was completed — remaining 6 records in 2 batches of 3
      expect(processedInRestore).toHaveLength(6);

      const status = restored!.getStatus();
      expect(status.status).toBe('COMPLETED');
      expect(status.progress.processedRecords).toBe(9);
      // Should have 3 batches of 3, not different sizing
      expect(status.progress.totalBatches).toBe(3);
    });

    it('should persist and restore maxConcurrentBatches, maxRetries, retryDelayMs, skipEmptyRows', async () => {
      const stateStore = new InMemoryStateStore();

      const csv = generateCsv(6);
      const engine = new BatchEngine({
        batchSize: 3,
        maxConcurrentBatches: 4,
        maxRetries: 3,
        retryDelayMs: 500,
        skipEmptyRows: true,
        continueOnError: true,
        stateStore,
      });

      engine.from(new BufferSource(csv), simpleCsvParser());
      await engine.start(async () => {
        await Promise.resolve();
      });

      const jobId = engine.getJobId();

      // Verify all config values are persisted
      const jobState = await stateStore.getJobState(jobId);
      expect(jobState).not.toBeNull();
      expect(jobState!.config.batchSize).toBe(3);
      expect(jobState!.config.maxConcurrentBatches).toBe(4);
      expect(jobState!.config.maxRetries).toBe(3);
      expect(jobState!.config.retryDelayMs).toBe(500);
      expect(jobState!.config.skipEmptyRows).toBe(true);
      expect(jobState!.config.continueOnError).toBe(true);
    });

    it('should use persisted maxConcurrentBatches even when caller omits it', async () => {
      const stateStore = new InMemoryStateStore();

      const jobId = 'test-restore-concurrency';
      await stateStore.saveJobState({
        id: jobId,
        config: { batchSize: 5, maxConcurrentBatches: 4, continueOnError: true },
        status: 'FAILED',
        batches: [{ id: 'b-0', index: 0, status: 'COMPLETED', records: [], processedCount: 5, failedCount: 0 }],
        totalRecords: 10,
        startedAt: Date.now() - 1000,
      });

      // Restore WITHOUT passing maxConcurrentBatches — should use persisted value (4)
      const csv = generateCsv(10);
      const restored = await BatchEngine.restore(jobId, { stateStore });
      expect(restored).not.toBeNull();

      restored!.from(new BufferSource(csv), simpleCsvParser());

      const processedInRestore: RawRecord[] = [];
      await restored!.start(async (record) => {
        processedInRestore.push(record);
        await Promise.resolve();
      });

      expect(processedInRestore).toHaveLength(5);
      expect(restored!.getStatus().status).toBe('COMPLETED');
    });

    it('should rebuild batchIndexById map on restore', async () => {
      const stateStore = new InMemoryStateStore();

      // Run a full job with 10 records, batchSize=5, completing both batches
      const csv = generateCsv(10);
      const engine = new BatchEngine({
        batchSize: 5,
        stateStore,
      });

      engine.from(new BufferSource(csv), simpleCsvParser());
      await engine.start(async () => {
        await Promise.resolve();
      });

      const jobId = engine.getJobId();
      const originalStatus = engine.getStatus();

      // Restore from the completed job
      const restored = await BatchEngine.restore(jobId, { stateStore });
      expect(restored).not.toBeNull();

      // The restored engine should have the same batch structure
      const restoredStatus = restored!.getStatus();
      expect(restoredStatus.batches).toHaveLength(originalStatus.batches.length);
    });
  });

  describe('FileStateStore integration', () => {
    it('should persist and restore with FileStateStore', async () => {
      const stateStore = new FileStateStore({ directory: TEST_DIR });

      const csv = generateCsv(5);
      const engine = new BatchEngine({
        batchSize: 10,
        stateStore,
        continueOnError: true,
      });

      engine.from(new BufferSource(csv), simpleCsvParser());
      await engine.start(async () => {
        await Promise.resolve();
      });

      const jobId = engine.getJobId();

      // Verify state was written to disk
      const jobState = await stateStore.getJobState(jobId);
      expect(jobState).not.toBeNull();
      expect(jobState?.status).toBe('COMPLETED');
      expect(jobState?.totalRecords).toBe(5);

      // Verify records were persisted
      const processed = await stateStore.getProcessedRecords(jobId);
      expect(processed).toHaveLength(5);
    });
  });
});
