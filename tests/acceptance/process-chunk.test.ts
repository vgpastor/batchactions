import { describe, it, expect } from 'vitest';
import { BulkImport } from '../../src/BulkImport.js';
import { CsvParser } from '../../src/infrastructure/parsers/CsvParser.js';
import { BufferSource } from '../../src/infrastructure/sources/BufferSource.js';
import { InMemoryStateStore } from '../../src/infrastructure/state/InMemoryStateStore.js';
import type { ChunkCompletedEvent } from '../../src/domain/events/DomainEvents.js';
import type { RawRecord } from '../../src/domain/model/Record.js';
import type { BulkImportConfig } from '../../src/BulkImport.js';

// --- Helpers ---

function generateCsv(count: number, includeInvalid = false): string {
  const header = 'email,name,age';
  const rows: string[] = [];
  for (let i = 1; i <= count; i++) {
    if (includeInvalid && i % 4 === 0) {
      rows.push(`not-an-email,User ${String(i)},${String(i * 10)}`);
    } else {
      rows.push(`user${String(i)}@test.com,User ${String(i)},${String(i * 10)}`);
    }
  }
  return [header, ...rows].join('\n');
}

function createConfig(overrides?: Partial<BulkImportConfig>): BulkImportConfig {
  return {
    schema: {
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'name', type: 'string', required: true },
        { name: 'age', type: 'number', required: false },
      ],
    },
    batchSize: 5,
    continueOnError: false,
    ...overrides,
  };
}

// ============================================================
// processChunk() — Serverless chunk processing
// ============================================================
describe('processChunk()', () => {
  it('should process all records in a single chunk when no limits are set', async () => {
    const csv = generateCsv(10);
    const importer = new BulkImport(createConfig());
    importer.from(new BufferSource(csv), new CsvParser());

    const processed: RawRecord[] = [];
    const result = await importer.processChunk(async (record) => {
      processed.push(record);
      await Promise.resolve();
    });

    expect(result.done).toBe(true);
    expect(result.processedRecords).toBe(10);
    expect(result.failedRecords).toBe(0);
    expect(result.totalProcessed).toBe(10);
    expect(result.totalFailed).toBe(0);
    expect(result.jobId).toBeTruthy();
    expect(processed).toHaveLength(10);
  });

  it('should stop after maxRecords and return done=false', async () => {
    const csv = generateCsv(25);
    const stateStore = new InMemoryStateStore();
    const importer = new BulkImport(createConfig({ stateStore, batchSize: 5 }));
    importer.from(new BufferSource(csv), new CsvParser());

    const processed: RawRecord[] = [];
    const result = await importer.processChunk(
      async (record) => {
        processed.push(record);
        await Promise.resolve();
      },
      { maxRecords: 10 },
    );

    expect(result.done).toBe(false);
    expect(result.processedRecords).toBe(10);
    expect(result.totalProcessed).toBe(10);
    expect(processed).toHaveLength(10);
  });

  it('should complete remaining records in a second chunk call', async () => {
    const csv = generateCsv(25);
    const stateStore = new InMemoryStateStore();
    const importer = new BulkImport(createConfig({ stateStore, batchSize: 5 }));
    importer.from(new BufferSource(csv), new CsvParser());

    // First chunk: process 10 records
    const allProcessed: RawRecord[] = [];
    const result1 = await importer.processChunk(
      async (record) => {
        allProcessed.push(record);
        await Promise.resolve();
      },
      { maxRecords: 10 },
    );

    expect(result1.done).toBe(false);
    expect(result1.processedRecords).toBe(10);

    // Second chunk: process remaining — same instance
    importer.from(new BufferSource(csv), new CsvParser());
    const result2 = await importer.processChunk(
      async (record) => {
        allProcessed.push(record);
        await Promise.resolve();
      },
      { maxRecords: 100 },
    );

    expect(result2.done).toBe(true);
    expect(result2.processedRecords).toBe(15);
    expect(result2.totalProcessed).toBe(25);
    expect(allProcessed).toHaveLength(25);
  });

  it('should stop after maxDurationMs', async () => {
    const csv = generateCsv(100);
    const stateStore = new InMemoryStateStore();
    const importer = new BulkImport(createConfig({ stateStore, batchSize: 5 }));
    importer.from(new BufferSource(csv), new CsvParser());

    const result = await importer.processChunk(
      async () => {
        // Simulate slow processing: 20ms per record
        await new Promise((resolve) => setTimeout(resolve, 20));
      },
      { maxDurationMs: 150 },
    );

    // Should have processed some but not all records
    expect(result.done).toBe(false);
    expect(result.processedRecords).toBeGreaterThan(0);
    expect(result.processedRecords).toBeLessThan(100);
  });

  it('should work with restore() between chunks', async () => {
    const csv = generateCsv(25);
    const stateStore = new InMemoryStateStore();
    const config = createConfig({ stateStore, batchSize: 5 });

    // First chunk
    const importer1 = new BulkImport(config);
    importer1.from(new BufferSource(csv), new CsvParser());

    const result1 = await importer1.processChunk(
      async () => {
        await Promise.resolve();
      },
      { maxRecords: 10 },
    );

    expect(result1.done).toBe(false);
    const jobId = result1.jobId;

    // Restore and continue — simulates a new serverless invocation
    const importer2 = await BulkImport.restore(jobId, config);
    expect(importer2).not.toBeNull();
    importer2!.from(new BufferSource(csv), new CsvParser());

    const result2 = await importer2!.processChunk(async () => {
      await Promise.resolve();
    });

    expect(result2.done).toBe(true);
    expect(result2.totalProcessed).toBe(25);
  });

  it('should emit chunk:completed event', async () => {
    const csv = generateCsv(15);
    const importer = new BulkImport(createConfig({ batchSize: 5 }));
    importer.from(new BufferSource(csv), new CsvParser());

    const chunkEvents: ChunkCompletedEvent[] = [];
    importer.on('chunk:completed', (e) => {
      chunkEvents.push(e);
    });

    await importer.processChunk(
      async () => {
        await Promise.resolve();
      },
      { maxRecords: 10 },
    );

    expect(chunkEvents).toHaveLength(1);
    expect(chunkEvents[0]?.processedRecords).toBe(10);
    expect(chunkEvents[0]?.done).toBe(false);
  });

  it('should emit import:completed when last chunk finishes', async () => {
    const csv = generateCsv(10);
    const importer = new BulkImport(createConfig({ batchSize: 5 }));
    importer.from(new BufferSource(csv), new CsvParser());

    const events: string[] = [];
    importer.on('import:completed', () => events.push('import:completed'));
    importer.on('chunk:completed', () => events.push('chunk:completed'));

    const result = await importer.processChunk(async () => {
      await Promise.resolve();
    });

    expect(result.done).toBe(true);
    expect(events).toContain('import:completed');
    expect(events).toContain('chunk:completed');
  });

  it('should track cumulative totals across chunks', async () => {
    const csv = generateCsv(20);
    const stateStore = new InMemoryStateStore();
    const importer = new BulkImport(createConfig({ stateStore, batchSize: 5 }));
    importer.from(new BufferSource(csv), new CsvParser());

    const result1 = await importer.processChunk(
      async () => {
        await Promise.resolve();
      },
      { maxRecords: 5 },
    );

    expect(result1.processedRecords).toBe(5);
    expect(result1.totalProcessed).toBe(5);

    // Second chunk on same instance
    importer.from(new BufferSource(csv), new CsvParser());
    const result2 = await importer.processChunk(
      async () => {
        await Promise.resolve();
      },
      { maxRecords: 5 },
    );

    expect(result2.processedRecords).toBe(5);
    expect(result2.totalProcessed).toBe(10);
  });

  it('should complete current batch before stopping (batch-level boundary)', async () => {
    const csv = generateCsv(20);
    const stateStore = new InMemoryStateStore();
    const importer = new BulkImport(createConfig({ stateStore, batchSize: 10 }));
    importer.from(new BufferSource(csv), new CsvParser());

    // maxRecords=5 but batchSize=10 — the full batch of 10 completes
    const result = await importer.processChunk(
      async () => {
        await Promise.resolve();
      },
      { maxRecords: 5 },
    );

    // Should have processed all 10 in the first batch (batch boundary)
    expect(result.processedRecords).toBe(10);
    expect(result.done).toBe(false);
  });

  it('should work with continueOnError across chunks', async () => {
    const csv = generateCsv(20, true); // every 4th record invalid
    const stateStore = new InMemoryStateStore();
    const importer = new BulkImport(createConfig({ stateStore, batchSize: 5, continueOnError: true }));
    importer.from(new BufferSource(csv), new CsvParser());

    const result1 = await importer.processChunk(
      async () => {
        await Promise.resolve();
      },
      { maxRecords: 5 },
    );

    expect(result1.done).toBe(false);
    expect(result1.processedRecords + result1.failedRecords).toBe(5);

    // Continue
    importer.from(new BufferSource(csv), new CsvParser());
    const result2 = await importer.processChunk(async () => {
      await Promise.resolve();
    });

    expect(result2.done).toBe(true);
    expect(result2.totalProcessed + result2.totalFailed).toBe(20);
  });
});
