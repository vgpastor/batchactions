import { describe, it, expect } from 'vitest';
import { BatchEngine } from '../../src/BatchEngine.js';
import type { RawRecord } from '../../src/domain/model/Record.js';
import type { ValidationResult } from '../../src/domain/model/ValidationResult.js';
import type { BatchCompletedEvent } from '../../src/domain/events/DomainEvents.js';

// --- Helpers ---

function createAccounts(count: number): RawRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `acc-${String(i + 1)}`,
    channel: 'email',
    provider: 'brevo',
    status: 'active',
  }));
}

// ============================================================
// Basic fromRecords() processing
// ============================================================
describe('fromRecords(): basic processing', () => {
  it('should process all in-memory records', async () => {
    const accounts = createAccounts(10);
    const engine = new BatchEngine({ batchSize: 5 });
    engine.fromRecords(accounts);

    const processed: RawRecord[] = [];
    await engine.start(async (record) => {
      processed.push(record);
      await Promise.resolve();
    });

    expect(processed).toHaveLength(10);
    const status = engine.getStatus();
    expect(status.status).toBe('COMPLETED');
    expect(status.progress.totalRecords).toBe(10);
    expect(status.progress.processedRecords).toBe(10);
    expect(status.progress.percentage).toBe(100);
  });

  it('should process an empty array without error', async () => {
    const engine = new BatchEngine();
    engine.fromRecords([]);

    const processed: RawRecord[] = [];
    await engine.start(async (record) => {
      processed.push(record);
      await Promise.resolve();
    });

    expect(processed).toHaveLength(0);
    const status = engine.getStatus();
    expect(status.status).toBe('COMPLETED');
    expect(status.progress.totalRecords).toBe(0);
  });

  it('should process a single record', async () => {
    const engine = new BatchEngine();
    engine.fromRecords([{ id: 'solo', value: 42 }]);

    const processed: RawRecord[] = [];
    await engine.start(async (record) => {
      processed.push(record);
      await Promise.resolve();
    });

    expect(processed).toHaveLength(1);
    expect(processed[0]).toEqual(expect.objectContaining({ id: 'solo', value: 42 }));
    expect(engine.getStatus().status).toBe('COMPLETED');
  });

  it('should support method chaining', async () => {
    const processed: RawRecord[] = [];
    const engine = new BatchEngine({ batchSize: 5 });

    // fromRecords returns `this` for chaining
    const result = engine.fromRecords(createAccounts(3));
    expect(result).toBe(engine);

    await engine.start(async (record) => {
      processed.push(record);
      await Promise.resolve();
    });

    expect(processed).toHaveLength(3);
  });
});

// ============================================================
// Batching
// ============================================================
describe('fromRecords(): batching', () => {
  it('should split records into batches according to batchSize', async () => {
    const accounts = createAccounts(25);
    const engine = new BatchEngine({ batchSize: 10 });
    engine.fromRecords(accounts);

    await engine.start(async () => {
      await Promise.resolve();
    });

    const status = engine.getStatus();
    expect(status.batches).toHaveLength(3); // 10 + 10 + 5
    expect(status.progress.processedRecords).toBe(25);
  });

  it('should process all records with batchSize larger than total', async () => {
    const accounts = createAccounts(5);
    const engine = new BatchEngine({ batchSize: 1000 });
    engine.fromRecords(accounts);

    await engine.start(async () => {
      await Promise.resolve();
    });

    const status = engine.getStatus();
    expect(status.batches).toHaveLength(1);
    expect(status.progress.processedRecords).toBe(5);
  });
});

// ============================================================
// Concurrent batches
// ============================================================
describe('fromRecords(): concurrent batches', () => {
  it('should process records concurrently with maxConcurrentBatches > 1', async () => {
    const accounts = createAccounts(30);
    const engine = new BatchEngine({
      batchSize: 10,
      maxConcurrentBatches: 3,
    });
    engine.fromRecords(accounts);

    const processed: RawRecord[] = [];
    await engine.start(async (record) => {
      processed.push(record);
      await new Promise((resolve) => setTimeout(resolve, 1));
    });

    expect(processed).toHaveLength(30);
    const status = engine.getStatus();
    expect(status.status).toBe('COMPLETED');
    expect(status.batches).toHaveLength(3);
  });
});

// ============================================================
// Validation
// ============================================================
describe('fromRecords(): validation', () => {
  it('should apply validate function to in-memory records', async () => {
    const records: RawRecord[] = [
      { id: 'valid-1', status: 'active' },
      { id: '', status: 'active' },
      { id: 'valid-2', status: 'active' },
    ];

    const engine = new BatchEngine({
      continueOnError: true,
      validate: (record): ValidationResult => {
        if (!record.id) {
          return {
            isValid: false,
            errors: [{ field: 'id', message: 'id is required', code: 'REQUIRED' as const }],
          };
        }
        return { isValid: true, errors: [] };
      },
    });
    engine.fromRecords(records);

    const processed: RawRecord[] = [];
    await engine.start(async (record) => {
      processed.push(record);
      await Promise.resolve();
    });

    expect(processed).toHaveLength(2);
    expect(await engine.getFailedRecords()).toHaveLength(1);
    expect(engine.getStatus().progress.failedRecords).toBe(1);
  });
});

// ============================================================
// Error handling & continueOnError
// ============================================================
describe('fromRecords(): error handling', () => {
  it('should stop on first processor error when continueOnError is false', async () => {
    const records = createAccounts(5);
    const engine = new BatchEngine({ continueOnError: false });
    engine.fromRecords(records);

    let callCount = 0;
    await engine.start(async () => {
      callCount++;
      if (callCount === 3) throw new Error('Processing failed');
      await Promise.resolve();
    });

    expect(engine.getStatus().status).toBe('FAILED');
  });

  it('should continue processing after errors when continueOnError is true', async () => {
    const records = createAccounts(5);
    const engine = new BatchEngine({ continueOnError: true });
    engine.fromRecords(records);

    let callCount = 0;
    await engine.start(async () => {
      callCount++;
      if (callCount === 3) throw new Error('Processing failed');
      await Promise.resolve();
    });

    expect(callCount).toBe(5);
    const status = engine.getStatus();
    expect(status.status).toBe('COMPLETED');
    expect(status.progress.processedRecords).toBe(4);
    expect(status.progress.failedRecords).toBe(1);
  });
});

// ============================================================
// Retry
// ============================================================
describe('fromRecords(): retry', () => {
  it('should retry failed records according to maxRetries config', async () => {
    const records: RawRecord[] = [{ id: 'retry-me' }];
    const engine = new BatchEngine({
      maxRetries: 2,
      retryDelayMs: 1,
      continueOnError: true,
    });
    engine.fromRecords(records);

    let attempts = 0;
    await engine.start(async () => {
      attempts++;
      if (attempts < 3) throw new Error('Transient failure');
      await Promise.resolve();
    });

    expect(attempts).toBe(3); // 1 initial + 2 retries
    expect(engine.getStatus().progress.processedRecords).toBe(1);
  });
});

// ============================================================
// Events
// ============================================================
describe('fromRecords(): events', () => {
  it('should emit job:started and job:completed events', async () => {
    const records = createAccounts(3);
    const engine = new BatchEngine();
    engine.fromRecords(records);

    const events: string[] = [];
    engine.on('job:started', () => events.push('started'));
    engine.on('job:completed', () => events.push('completed'));

    await engine.start(async () => {
      await Promise.resolve();
    });

    expect(events).toEqual(['started', 'completed']);
  });

  it('should emit batch events for each batch', async () => {
    const records = createAccounts(15);
    const engine = new BatchEngine({ batchSize: 5 });
    engine.fromRecords(records);

    const batchEvents: BatchCompletedEvent[] = [];
    engine.on('batch:completed', (event) => batchEvents.push(event));

    await engine.start(async () => {
      await Promise.resolve();
    });

    expect(batchEvents).toHaveLength(3);
    expect(batchEvents[0]!.processedCount).toBe(5);
  });

  it('should emit progress events', async () => {
    const records = createAccounts(10);
    const engine = new BatchEngine({ batchSize: 5 });
    engine.fromRecords(records);

    const progressPercentages: number[] = [];
    engine.on('job:progress', (event) => progressPercentages.push(event.progress.percentage));

    await engine.start(async () => {
      await Promise.resolve();
    });

    expect(progressPercentages).toHaveLength(2); // one per batch
    // After all batches complete, the final status should report 100%
    const finalStatus = engine.getStatus();
    expect(finalStatus.progress.percentage).toBe(100);
  });
});

// ============================================================
// Lifecycle hooks
// ============================================================
describe('fromRecords(): lifecycle hooks', () => {
  it('should invoke beforeProcess and afterProcess hooks', async () => {
    const records: RawRecord[] = [{ id: 'hook-test' }];
    const hookCalls: string[] = [];

    const engine = new BatchEngine({
      hooks: {
        beforeProcess: (parsed) => {
          hookCalls.push('beforeProcess');
          return Promise.resolve(parsed);
        },
        afterProcess: () => {
          hookCalls.push('afterProcess');
          return Promise.resolve();
        },
      },
    });
    engine.fromRecords(records);

    await engine.start(async () => {
      await Promise.resolve();
    });

    expect(hookCalls).toEqual(['beforeProcess', 'afterProcess']);
  });
});

// ============================================================
// count() with fromRecords
// ============================================================
describe('fromRecords(): count()', () => {
  it('should count records from an array', async () => {
    const records = createAccounts(7);
    const engine = new BatchEngine();
    engine.fromRecords(records);

    const count = await engine.count();
    expect(count).toBe(7);
  });
});

// ============================================================
// AsyncIterable support
// ============================================================
describe('fromRecords(): async iterable', () => {
  it('should process records from an async generator', async () => {
    function* generateAccounts(): Iterable<RawRecord> {
      for (let i = 0; i < 5; i++) {
        yield { id: `async-${String(i)}`, channel: 'sms' };
      }
    }

    const engine = new BatchEngine({ batchSize: 2 });
    engine.fromRecords(generateAccounts());

    const processed: RawRecord[] = [];
    await engine.start(async (record) => {
      processed.push(record);
      await Promise.resolve();
    });

    expect(processed).toHaveLength(5);
    expect(engine.getStatus().status).toBe('COMPLETED');
    expect(engine.getStatus().batches).toHaveLength(3); // 2 + 2 + 1
  });
});

// ============================================================
// Abort
// ============================================================
describe('fromRecords(): abort', () => {
  it('should abort processing when abort() is called', async () => {
    const records = createAccounts(100);
    const engine = new BatchEngine({ batchSize: 10, continueOnError: true });
    engine.fromRecords(records);

    let processedCount = 0;
    const startPromise = engine.start(async () => {
      processedCount++;
      if (processedCount === 15) {
        await engine.abort();
      }
      await Promise.resolve();
    });

    await startPromise;
    expect(engine.getStatus().status).toBe('ABORTED');
    expect(processedCount).toBeLessThan(100);
  });
});

// ============================================================
// Throws if no source configured
// ============================================================
describe('fromRecords(): error when no source', () => {
  it('should throw when start() is called without from() or fromRecords()', async () => {
    const engine = new BatchEngine();
    await expect(
      engine.start(async () => {
        await Promise.resolve();
      }),
    ).rejects.toThrow(/from\(source, parser\) or \.fromRecords\(records\)/);
  });
});
