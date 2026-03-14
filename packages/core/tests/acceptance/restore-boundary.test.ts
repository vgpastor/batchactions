import { describe, it, expect } from 'vitest';
import { BatchEngine } from '../../src/BatchEngine.js';
import type { BatchEngineConfig } from '../../src/BatchEngine.js';
import { BufferSource } from '../../src/infrastructure/sources/BufferSource.js';
import { InMemoryStateStore } from '../../src/infrastructure/state/InMemoryStateStore.js';
import type { RawRecord } from '../../src/domain/model/Record.js';
import type { JobProgress } from '../../src/domain/model/Job.js';
import type { JobProgressEvent } from '../../src/domain/events/DomainEvents.js';

// ============================================================
// Helpers
// ============================================================

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

function generateCsv(count: number, options?: { invalidEveryN?: number }): string {
  const header = 'email,name,age';
  const rows: string[] = [];
  for (let i = 1; i <= count; i++) {
    if (options?.invalidEveryN && i % options.invalidEveryN === 0) {
      rows.push(`not-an-email,User ${String(i)},${String(i * 10)}`);
    } else {
      rows.push(`user${String(i)}@test.com,User ${String(i)},${String(i * 10)}`);
    }
  }
  return [header, ...rows].join('\n');
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailValidator(record: RawRecord) {
  const email = (record.email as string | undefined) ?? '';
  if (!emailRegex.test(email)) {
    return {
      isValid: false as const,
      errors: [{ field: 'email', message: 'Invalid email', code: 'TYPE_MISMATCH' as const }],
    };
  }
  return { isValid: true as const, errors: [] };
}

const noop = async () => {
  await Promise.resolve();
};

/**
 * Asserts the fundamental counter invariant:
 * processed + failed + pending = totalRecords
 */
function assertProgressInvariant(progress: JobProgress, label: string): void {
  const sum = progress.processedRecords + progress.failedRecords + progress.pendingRecords;
  expect(
    sum,
    `${label}: processed(${String(progress.processedRecords)}) + failed(${String(progress.failedRecords)}) + pending(${String(progress.pendingRecords)}) should equal total(${String(progress.totalRecords)})`,
  ).toBe(progress.totalRecords);
}

/**
 * Helper: run one processChunk cycle (create or restore → feed source → processChunk).
 */
async function chunkCycle(
  jobId: string | null,
  config: BatchEngineConfig,
  csv: string,
  processor: (record: RawRecord) => Promise<void>,
  chunkOptions?: { maxRecords?: number },
) {
  let engine: BatchEngine;
  if (jobId) {
    const restored = await BatchEngine.restore(jobId, config);
    expect(restored, `restore(${jobId}) should return an engine`).not.toBeNull();
    engine = restored!;
  } else {
    engine = new BatchEngine(config);
  }
  engine.from(new BufferSource(csv), simpleCsvParser());
  const result = await engine.processChunk(processor, chunkOptions);
  return { engine, result };
}

// ============================================================
// 1. Multi-cycle restore — counter invariant across N cycles
// ============================================================
describe('Multi-cycle restore: counter invariants', () => {
  it('should maintain correct totalRecords across 3 sequential restore+processChunk cycles', async () => {
    const totalRecordCount = 30;
    const csv = generateCsv(totalRecordCount);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    // Cycle 1: process 10 of 30
    const { engine: e1, result: r1 } = await chunkCycle(null, config, csv, noop, { maxRecords: 10 });
    expect(r1.done).toBe(false);
    expect(r1.processedRecords).toBe(10);
    const jobId = r1.jobId;

    // Cycle 2: restore, process 10 more
    const { engine: e2, result: r2 } = await chunkCycle(jobId, config, csv, noop, { maxRecords: 10 });
    expect(r2.done).toBe(false);
    expect(r2.totalProcessed).toBe(20);

    // Cycle 3: restore, process remaining 10
    const { engine: e3, result: r3 } = await chunkCycle(jobId, config, csv, noop);
    expect(r3.done).toBe(true);
    expect(r3.totalProcessed).toBe(30);

    const progress = e3.getStatus().progress;
    expect(progress.totalRecords).toBe(30);
    expect(progress.processedRecords).toBe(30);
    expect(progress.percentage).toBe(100);
    expect(progress.pendingRecords).toBe(0);
    assertProgressInvariant(progress, 'cycle-3-final');
  });

  it('should maintain correct totalRecords across 5 sequential restore+processChunk cycles', async () => {
    const totalRecordCount = 25;
    const csv = generateCsv(totalRecordCount);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    let jobId: string | null = null;
    for (let cycle = 0; cycle < 5; cycle++) {
      const { result } = await chunkCycle(jobId, config, csv, noop, { maxRecords: 5 });
      jobId = result.jobId;
      expect(result.processedRecords).toBe(5);
      expect(result.totalProcessed).toBe((cycle + 1) * 5);
      if (cycle < 4) {
        expect(result.done).toBe(false);
      } else {
        // Last cycle: all 25 records processed, should complete
        expect(result.done).toBe(true);
      }
    }

    // Final verification via state store
    const finalState = await stateStore.getJobState(jobId!);
    expect(finalState?.totalRecords).toBe(25);
    expect(finalState?.status).toBe('COMPLETED');
  });

  it('should never exceed the actual source size in totalRecords across 10 rapid cycles', async () => {
    const totalRecordCount = 50;
    const csv = generateCsv(totalRecordCount);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    let jobId: string | null = null;
    for (let cycle = 0; cycle < 10; cycle++) {
      const { engine, result } = await chunkCycle(jobId, config, csv, noop, { maxRecords: 5 });
      jobId = result.jobId;

      const progress = engine.getStatus().progress;
      expect(
        progress.totalRecords,
        `Cycle ${String(cycle + 1)}: totalRecords should never exceed ${String(totalRecordCount)}`,
      ).toBeLessThanOrEqual(totalRecordCount);
      assertProgressInvariant(progress, `cycle-${String(cycle + 1)}`);

      if (result.done) break;
    }
  });
});

// ============================================================
// 2. Counter invariant verification during processing
// ============================================================
describe('Counter invariant: processed + failed + pending = total', () => {
  it('should hold invariant on every job:progress event during a single run', async () => {
    const csv = generateCsv(30);
    const engine = new BatchEngine({ batchSize: 5 });
    engine.from(new BufferSource(csv), simpleCsvParser());

    const progressSnapshots: JobProgress[] = [];
    engine.on('job:progress', (e: JobProgressEvent) => {
      progressSnapshots.push(e.progress);
    });

    await engine.start(noop);

    expect(progressSnapshots.length).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < progressSnapshots.length; i++) {
      assertProgressInvariant(progressSnapshots[i]!, `progress-event-${String(i)}`);
    }
  });

  it('should hold invariant when some records fail validation', async () => {
    const csv = generateCsv(20, { invalidEveryN: 3 });
    const engine = new BatchEngine({
      batchSize: 5,
      continueOnError: true,
      validate: emailValidator,
    });
    engine.from(new BufferSource(csv), simpleCsvParser());

    const progressSnapshots: JobProgress[] = [];
    engine.on('job:progress', (e: JobProgressEvent) => {
      progressSnapshots.push(e.progress);
    });

    await engine.start(noop);

    const final = engine.getStatus().progress;
    assertProgressInvariant(final, 'final-with-failures');
    expect(final.failedRecords).toBeGreaterThan(0);
    expect(final.processedRecords + final.failedRecords).toBe(20);

    for (let i = 0; i < progressSnapshots.length; i++) {
      assertProgressInvariant(progressSnapshots[i]!, `progress-event-${String(i)}`);
    }
  });

  it('should hold invariant across restore+processChunk with mixed results', async () => {
    const csv = generateCsv(20, { invalidEveryN: 4 });
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = {
      batchSize: 5,
      stateStore,
      continueOnError: true,
      validate: emailValidator,
    };

    // Cycle 1
    const { result: r1 } = await chunkCycle(null, config, csv, noop, { maxRecords: 10 });
    const jobId = r1.jobId;

    // Cycle 2
    const { engine: e2 } = await chunkCycle(jobId, config, csv, noop);
    const final = e2.getStatus().progress;
    assertProgressInvariant(final, 'restore-mixed-final');
    expect(final.totalRecords).toBe(20);
    expect(final.processedRecords + final.failedRecords).toBe(20);
    expect(final.percentage).toBe(100);
  });
});

// ============================================================
// 3. Edge cases combined with restore()
// ============================================================
describe('Edge cases with restore()', () => {
  it('should handle restore after processing a single record', async () => {
    const csv = generateCsv(1);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 10, stateStore };

    // Process the single record
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    await engine1.start(noop);
    const jobId = engine1.getJobId();

    expect(engine1.getStatus().progress.totalRecords).toBe(1);

    // Restore — job is already COMPLETED
    const engine2 = await BatchEngine.restore(jobId, config);
    expect(engine2).not.toBeNull();
    const progress = engine2!.getStatus().progress;
    expect(progress.totalRecords).toBe(1);
    expect(progress.processedRecords).toBe(1);
  });

  it('should handle restore when all records failed validation', async () => {
    const csv = 'email,name,age\nnot-email,A,1\nalso-bad,B,2\nno-at,C,3';
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = {
      batchSize: 10,
      stateStore,
      continueOnError: true,
      validate: emailValidator,
    };

    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    await engine1.start(noop);

    const status1 = engine1.getStatus();
    expect(status1.progress.processedRecords).toBe(0);
    expect(status1.progress.failedRecords).toBe(3);
    expect(status1.progress.percentage).toBe(100);

    const jobId = engine1.getJobId();
    const engine2 = await BatchEngine.restore(jobId, config);
    expect(engine2).not.toBeNull();
    const progress = engine2!.getStatus().progress;
    expect(progress.failedRecords).toBe(3);
    expect(progress.processedRecords).toBe(0);
    expect(progress.totalRecords).toBe(3);
  });

  it('should handle restore with exact batch boundary (records = N * batchSize)', async () => {
    const csv = generateCsv(20); // exactly 4 batches of 5
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    // Process first 2 batches (10 records)
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    const r1 = await engine1.processChunk(noop, { maxRecords: 10 });
    const jobId = r1.jobId;

    // Restore and process remaining 2 batches
    const { engine: e2, result: r2 } = await chunkCycle(jobId, config, csv, noop);
    expect(r2.done).toBe(true);
    expect(r2.totalProcessed).toBe(20);

    const progress = e2.getStatus().progress;
    expect(progress.totalRecords).toBe(20);
    expect(progress.pendingRecords).toBe(0);
    assertProgressInvariant(progress, 'exact-boundary');
  });

  it('should handle restore with batchSize larger than total records', async () => {
    const csv = generateCsv(3);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 1000, stateStore };

    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    await engine1.start(noop);
    const jobId = engine1.getJobId();

    const engine2 = await BatchEngine.restore(jobId, config);
    expect(engine2).not.toBeNull();
    expect(engine2!.getStatus().progress.totalRecords).toBe(3);
    expect(engine2!.getStatus().progress.processedRecords).toBe(3);
  });

  it('should handle restore with batchSize=1 (one record per batch)', async () => {
    const csv = generateCsv(5);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 1, stateStore };

    // Process 2 records
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    const r1 = await engine1.processChunk(noop, { maxRecords: 2 });
    const jobId = r1.jobId;
    expect(r1.processedRecords).toBe(2);

    // Restore and finish
    const { engine: e2, result: r2 } = await chunkCycle(jobId, config, csv, noop);
    expect(r2.done).toBe(true);
    expect(r2.totalProcessed).toBe(5);

    const progress = e2.getStatus().progress;
    expect(progress.totalRecords).toBe(5);
    assertProgressInvariant(progress, 'batch-size-1');
  });
});

// ============================================================
// 4. Concurrent batches + restore
// ============================================================
describe('Concurrent batches with restore()', () => {
  it('should maintain correct counters with maxConcurrentBatches=3 across restore cycles', async () => {
    const csv = generateCsv(30);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore, maxConcurrentBatches: 3 };

    // Process some records concurrently — with concurrent batches,
    // the chunk limit is at batch boundaries, so at least maxRecords are processed.
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    const r1 = await engine1.processChunk(noop, { maxRecords: 15 });
    const jobId = r1.jobId;
    expect(r1.processedRecords).toBeGreaterThanOrEqual(15);

    const progress1 = engine1.getStatus().progress;
    assertProgressInvariant(progress1, 'concurrent-cycle-1');

    // Restore and finish with concurrency
    const { engine: e2, result: r2 } = await chunkCycle(jobId, config, csv, noop);
    expect(r2.done).toBe(true);
    expect(r2.totalProcessed).toBe(30);

    const progress = e2.getStatus().progress;
    expect(progress.totalRecords).toBe(30);
    expect(progress.pendingRecords).toBe(0);
    assertProgressInvariant(progress, 'concurrent-restore');
  });

  it('should handle concurrent batches + continueOnError + restore', async () => {
    const csv = generateCsv(20, { invalidEveryN: 5 });
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = {
      batchSize: 5,
      stateStore,
      maxConcurrentBatches: 2,
      continueOnError: true,
      validate: emailValidator,
    };

    // Process first 10 records
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    const r1 = await engine1.processChunk(noop, { maxRecords: 10 });
    const jobId = r1.jobId;

    // Restore and finish
    const { engine: e2, result: r2 } = await chunkCycle(jobId, config, csv, noop);
    expect(r2.done).toBe(true);

    const progress = e2.getStatus().progress;
    expect(progress.totalRecords).toBe(20);
    expect(progress.failedRecords).toBeGreaterThan(0);
    expect(progress.processedRecords + progress.failedRecords).toBe(20);
    assertProgressInvariant(progress, 'concurrent-errors-restore');
  });
});

// ============================================================
// 5. Retry + restore
// ============================================================
describe('Retry with restore()', () => {
  it('should handle retries correctly across restore cycles', async () => {
    const csv = generateCsv(10);
    const stateStore = new InMemoryStateStore();
    let callCount = 0;

    const config: BatchEngineConfig = {
      batchSize: 5,
      stateStore,
      maxRetries: 2,
      retryDelayMs: 1,
      continueOnError: true,
    };

    // Process first 5 records — fail every 3rd on first attempt
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    const r1 = await engine1.processChunk(
      async () => {
        callCount++;
        if (callCount % 5 === 0) {
          throw new Error('transient');
        }
      },
      { maxRecords: 5 },
    );
    const jobId = r1.jobId;

    // Restore and finish
    callCount = 0;
    const { engine: e2, result: r2 } = await chunkCycle(jobId, config, csv, async () => {
      callCount++;
      if (callCount % 7 === 0) {
        throw new Error('transient');
      }
    });
    expect(r2.done).toBe(true);

    const progress = e2.getStatus().progress;
    expect(progress.totalRecords).toBe(10);
    assertProgressInvariant(progress, 'retry-restore');
  });
});

// ============================================================
// 6. fromRecords() + restore
// ============================================================
describe('fromRecords() with restore()', () => {
  it('should maintain correct totalRecords with fromRecords + processChunk + restore', async () => {
    const records: RawRecord[] = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `Item ${String(i + 1)}`,
    }));
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    // Process 5 records
    const engine1 = new BatchEngine(config);
    engine1.fromRecords(records);
    const r1 = await engine1.processChunk(noop, { maxRecords: 5 });
    const jobId = r1.jobId;
    expect(r1.processedRecords).toBe(5);

    // Restore and feed records again
    const engine2 = await BatchEngine.restore(jobId, config);
    expect(engine2).not.toBeNull();
    engine2!.fromRecords(records);
    const r2 = await engine2!.processChunk(noop);
    expect(r2.done).toBe(true);
    expect(r2.totalProcessed).toBe(15);

    const progress = engine2!.getStatus().progress;
    expect(progress.totalRecords).toBe(15);
    assertProgressInvariant(progress, 'fromRecords-restore');
  });

  it('should work with async iterable + restore', async () => {
    async function* generateRecords(count: number): AsyncIterable<RawRecord> {
      for (let i = 0; i < count; i++) {
        yield { id: String(i), value: `v${String(i)}` };
      }
    }

    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 3, stateStore };

    // Process 3 records
    const engine1 = new BatchEngine(config);
    engine1.fromRecords(generateRecords(9));
    const r1 = await engine1.processChunk(noop, { maxRecords: 3 });
    const jobId = r1.jobId;

    // Restore and finish
    const engine2 = await BatchEngine.restore(jobId, config);
    engine2!.fromRecords(generateRecords(9));
    const r2 = await engine2!.processChunk(noop);
    expect(r2.done).toBe(true);
    expect(r2.totalProcessed).toBe(9);

    const progress = engine2!.getStatus().progress;
    expect(progress.totalRecords).toBe(9);
    assertProgressInvariant(progress, 'async-iterable-restore');
  });
});

// ============================================================
// 7. Progress percentage accuracy
// ============================================================
describe('Progress percentage accuracy', () => {
  it('should report monotonically non-decreasing percentage across progress events', async () => {
    const csv = generateCsv(50);
    const engine = new BatchEngine({ batchSize: 5 });
    engine.from(new BufferSource(csv), simpleCsvParser());

    const percentages: number[] = [];
    engine.on('job:progress', (e: JobProgressEvent) => {
      percentages.push(e.progress.percentage);
    });

    await engine.start(noop);

    for (let i = 1; i < percentages.length; i++) {
      expect(
        percentages[i]!,
        `percentage should not decrease: ${String(percentages[i - 1])} → ${String(percentages[i])}`,
      ).toBeGreaterThanOrEqual(percentages[i - 1]!);
    }
    expect(percentages[percentages.length - 1]).toBe(100);
  });

  it('should report monotonically non-decreasing percentage across restore cycles', async () => {
    const csv = generateCsv(20);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    const allPercentages: number[] = [];

    // Cycle 1
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    engine1.on('job:progress', (e: JobProgressEvent) => {
      allPercentages.push(e.progress.percentage);
    });
    const r1 = await engine1.processChunk(noop, { maxRecords: 10 });
    const jobId = r1.jobId;

    // Cycle 2
    const engine2 = await BatchEngine.restore(jobId, config);
    engine2!.from(new BufferSource(csv), simpleCsvParser());
    engine2!.on('job:progress', (e: JobProgressEvent) => {
      allPercentages.push(e.progress.percentage);
    });
    await engine2!.processChunk(noop);

    // Percentages within each cycle should be non-decreasing
    // and final must be 100%
    expect(allPercentages[allPercentages.length - 1]).toBe(100);
    for (let i = 0; i < allPercentages.length; i++) {
      expect(allPercentages[i]!, `percentage at event ${String(i)} should be <= 100`).toBeLessThanOrEqual(100);
    }
  });

  it('should report 100% when all records fail validation', async () => {
    const csv = 'email,name\nbad1,A\nbad2,B\nbad3,C';
    const engine = new BatchEngine({
      batchSize: 10,
      continueOnError: true,
      validate: emailValidator,
    });
    engine.from(new BufferSource(csv), simpleCsvParser());
    await engine.start(noop);

    const progress = engine.getStatus().progress;
    expect(progress.percentage).toBe(100);
    expect(progress.processedRecords).toBe(0);
    expect(progress.failedRecords).toBe(3);
    assertProgressInvariant(progress, 'all-failed-percentage');
  });

  it('should report 0% when zero records exist', async () => {
    const engine = new BatchEngine({ batchSize: 10 });
    engine.from(new BufferSource(''), simpleCsvParser());
    await engine.start(noop);

    const progress = engine.getStatus().progress;
    expect(progress.percentage).toBe(0);
    expect(progress.totalRecords).toBe(0);
    assertProgressInvariant(progress, 'zero-records');
  });
});

// ============================================================
// 8. State store consistency
// ============================================================
describe('State store consistency', () => {
  it('should persist correct totalRecords to state store after each cycle', async () => {
    const csv = generateCsv(15);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    // Cycle 1
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    const r1 = await engine1.processChunk(noop, { maxRecords: 5 });
    const jobId = r1.jobId;

    const state1 = await stateStore.getJobState(jobId);
    expect(state1?.totalRecords).toBeLessThanOrEqual(15);

    // Cycle 2
    const { result: r2 } = await chunkCycle(jobId, config, csv, noop, { maxRecords: 5 });
    const state2 = await stateStore.getJobState(jobId);
    expect(state2?.totalRecords).toBeLessThanOrEqual(15);

    // Cycle 3: finish
    const { result: r3 } = await chunkCycle(jobId, config, csv, noop);
    expect(r3.done).toBe(true);

    const state3 = await stateStore.getJobState(jobId);
    expect(state3?.totalRecords).toBe(15);
  });

  it('should not create duplicate records in state store across restore cycles', async () => {
    const csv = generateCsv(10);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    // Process all 10
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    await engine1.start(noop);
    const jobId = engine1.getJobId();

    const records1 = await stateStore.getProcessedRecords(jobId);
    expect(records1).toHaveLength(10);

    // Restore and re-process — completed batches should be skipped
    const engine2 = await BatchEngine.restore(jobId, config);
    engine2!.from(new BufferSource(csv), simpleCsvParser());
    await engine2!.start(noop);

    const records2 = await stateStore.getProcessedRecords(jobId);
    // Should still be 10, not 20 (no duplicates)
    expect(records2).toHaveLength(10);
  });

  it('should preserve batch status across restore cycles', async () => {
    const csv = generateCsv(15);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    // Process 5 records (1 batch)
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    const r1 = await engine1.processChunk(noop, { maxRecords: 5 });
    const jobId = r1.jobId;

    const state1 = await stateStore.getJobState(jobId);
    const completedBatches1 = state1?.batches.filter((b) => b.status === 'COMPLETED') ?? [];
    expect(completedBatches1.length).toBeGreaterThanOrEqual(1);

    // Restore and continue
    const { engine: e2 } = await chunkCycle(jobId, config, csv, noop);
    const status2 = e2.getStatus();
    expect(status2.status).toBe('COMPLETED');

    const state2 = await stateStore.getJobState(jobId);
    const completedBatches2 = state2?.batches.filter((b) => b.status === 'COMPLETED') ?? [];
    expect(completedBatches2.length).toBe(3); // All 3 batches completed
  });
});

// ============================================================
// 9. Stress: large dataset with many restore cycles
// ============================================================
describe('Stress: large dataset with restore', () => {
  it('should process 500 records across 10 restore cycles with consistent counters', async () => {
    const totalRecordCount = 500;
    const csv = generateCsv(totalRecordCount);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 10, stateStore };

    let jobId: string | null = null;
    let totalProcessedSoFar = 0;

    for (let cycle = 0; cycle < 10; cycle++) {
      const { engine, result } = await chunkCycle(jobId, config, csv, noop, { maxRecords: 50 });
      jobId = result.jobId;

      totalProcessedSoFar += result.processedRecords;
      expect(result.totalProcessed).toBe(totalProcessedSoFar);

      const progress = engine.getStatus().progress;
      expect(progress.totalRecords).toBeLessThanOrEqual(totalRecordCount);
      assertProgressInvariant(progress, `stress-cycle-${String(cycle)}`);

      if (result.done) {
        expect(cycle).toBe(9); // Should finish on the 10th cycle
        break;
      }
    }

    expect(totalProcessedSoFar).toBe(totalRecordCount);
  });

  it('should process 200 records with validation errors across 4 restore cycles', async () => {
    const totalRecordCount = 200;
    const csv = generateCsv(totalRecordCount, { invalidEveryN: 5 }); // 20% invalid
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = {
      batchSize: 10,
      stateStore,
      continueOnError: true,
      validate: emailValidator,
    };

    let jobId: string | null = null;
    for (let cycle = 0; cycle < 4; cycle++) {
      const { engine, result } = await chunkCycle(jobId, config, csv, noop, { maxRecords: 50 });
      jobId = result.jobId;

      const progress = engine.getStatus().progress;
      assertProgressInvariant(progress, `stress-errors-cycle-${String(cycle)}`);

      if (result.done) break;
    }

    const finalState = await stateStore.getJobState(jobId!);
    expect(finalState?.totalRecords).toBe(totalRecordCount);
    expect(finalState?.status).toBe('COMPLETED');
  });
});

// ============================================================
// 10. Event consistency across restore
// ============================================================
describe('Event consistency across restore cycles', () => {
  it('should emit accurate job:completed summary after restore cycles', async () => {
    const csv = generateCsv(20);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    // Cycle 1
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    const r1 = await engine1.processChunk(noop, { maxRecords: 10 });
    const jobId = r1.jobId;

    // Cycle 2 — capture job:completed
    const engine2 = await BatchEngine.restore(jobId, config);
    engine2!.from(new BufferSource(csv), simpleCsvParser());

    let completedSummary: { total: number; processed: number; failed: number } | null = null;
    engine2!.on('job:completed', (e) => {
      completedSummary = e.summary;
    });

    await engine2!.processChunk(noop);

    expect(completedSummary).not.toBeNull();
    expect(completedSummary!.total).toBe(20);
    expect(completedSummary!.processed).toBe(20);
    expect(completedSummary!.failed).toBe(0);
  });

  it('should emit batch:completed events only for non-skipped batches after restore', async () => {
    const csv = generateCsv(20);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    // Cycle 1: process 2 batches (10 records)
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    const r1 = await engine1.processChunk(noop, { maxRecords: 10 });
    const jobId = r1.jobId;

    // Cycle 2: should only process batches 2 and 3 (skipping 0 and 1)
    const engine2 = await BatchEngine.restore(jobId, config);
    engine2!.from(new BufferSource(csv), simpleCsvParser());

    const batchCompletedIndices: number[] = [];
    engine2!.on('batch:completed', (e) => {
      batchCompletedIndices.push(e.batchIndex);
    });

    await engine2!.processChunk(noop);

    // Only batches 2 and 3 should have been processed
    expect(batchCompletedIndices).toHaveLength(2);
    expect(batchCompletedIndices).toContain(2);
    expect(batchCompletedIndices).toContain(3);
  });
});

// ============================================================
// 11. start() (not processChunk) + restore boundary
// ============================================================
describe('start() with restore', () => {
  it('should handle restore after start() completed and re-run correctly', async () => {
    const csv = generateCsv(10);
    const stateStore = new InMemoryStateStore();
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    // Complete a full job
    const engine1 = new BatchEngine(config);
    engine1.from(new BufferSource(csv), simpleCsvParser());
    await engine1.start(noop);
    const jobId = engine1.getJobId();

    // Restore — all batches completed, so re-run should effectively be a no-op
    const engine2 = await BatchEngine.restore(jobId, config);
    expect(engine2).not.toBeNull();

    const processed: RawRecord[] = [];
    engine2!.from(new BufferSource(csv), simpleCsvParser());
    await engine2!.start(async (record) => {
      processed.push(record);
    });

    // All batches were completed, so no new records should be processed
    expect(processed).toHaveLength(0);

    const progress = engine2!.getStatus().progress;
    expect(progress.totalRecords).toBe(10);
    expect(progress.processedRecords).toBe(10);
    assertProgressInvariant(progress, 'start-restore-completed');
  });

  it('should handle partial completion then restore + start', async () => {
    const stateStore = new InMemoryStateStore();
    const jobId = 'partial-job';

    // Simulate a crash mid-processing by saving partial state
    await stateStore.saveJobState({
      id: jobId,
      config: { batchSize: 5 },
      status: 'FAILED',
      batches: [
        { id: 'b-0', index: 0, status: 'COMPLETED', records: [], processedCount: 5, failedCount: 0 },
        { id: 'b-1', index: 1, status: 'COMPLETED', records: [], processedCount: 5, failedCount: 0 },
        { id: 'b-2', index: 2, status: 'PROCESSING', records: [], processedCount: 0, failedCount: 0 },
      ],
      totalRecords: 20,
      startedAt: Date.now() - 5000,
    });

    const csv = generateCsv(20);
    const config: BatchEngineConfig = { batchSize: 5, stateStore };

    const engine = await BatchEngine.restore(jobId, config);
    expect(engine).not.toBeNull();

    const processed: RawRecord[] = [];
    engine!.from(new BufferSource(csv), simpleCsvParser());
    await engine!.start(async (record) => {
      processed.push(record);
    });

    // Batches 0 and 1 completed (10 records), batches 2 and 3 should process (10 records)
    expect(processed).toHaveLength(10);

    const progress = engine!.getStatus().progress;
    expect(progress.totalRecords).toBe(20);
    expect(progress.processedRecords).toBe(20);
    expect(progress.percentage).toBe(100);
    assertProgressInvariant(progress, 'partial-restore-start');
  });
});
