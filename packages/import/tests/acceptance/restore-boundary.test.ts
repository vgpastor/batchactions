import { describe, it, expect } from 'vitest';
import { BulkImport } from '../../src/BulkImport.js';
import type { BulkImportConfig } from '../../src/BulkImport.js';
import { CsvParser } from '../../src/infrastructure/parsers/CsvParser.js';
import { BufferSource, InMemoryStateStore } from '@batchactions/core';
import type { RawRecord, JobProgress, JobProgressEvent } from '@batchactions/core';

// ============================================================
// Helpers
// ============================================================

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

const noop = async () => {
  await Promise.resolve();
};

function assertProgressInvariant(progress: JobProgress, label: string): void {
  const sum = progress.processedRecords + progress.failedRecords + progress.pendingRecords;
  expect(
    sum,
    `${label}: processed(${String(progress.processedRecords)}) + failed(${String(progress.failedRecords)}) + pending(${String(progress.pendingRecords)}) should equal total(${String(progress.totalRecords)})`,
  ).toBe(progress.totalRecords);
}

// ============================================================
// 1. BulkImport restore + processChunk
// ============================================================
describe('BulkImport restore + processChunk', () => {
  it('should not inflate totalRecords across restore cycles', async () => {
    const csv = generateCsv(20);
    const stateStore = new InMemoryStateStore();
    const config = createConfig({ stateStore });

    // Cycle 1: process 10 of 20 records
    const importer1 = new BulkImport(config);
    importer1.from(new BufferSource(csv), new CsvParser());
    const r1 = await importer1.processChunk(noop, { maxRecords: 10 });
    const jobId = r1.jobId;
    expect(r1.done).toBe(false);
    expect(r1.processedRecords).toBe(10);

    // Cycle 2: restore and complete
    const importer2 = await BulkImport.restore(jobId, config);
    expect(importer2).not.toBeNull();
    importer2!.from(new BufferSource(csv), new CsvParser());
    const r2 = await importer2!.processChunk(noop);
    expect(r2.done).toBe(true);
    expect(r2.totalProcessed).toBe(20);

    const progress = importer2!.getStatus().progress;
    expect(progress.totalRecords).toBe(20);
    expect(progress.percentage).toBe(100);
    expect(progress.pendingRecords).toBe(0);
    assertProgressInvariant(progress, 'import-restore');
  });

  it('should maintain correct counters across 3 restore cycles with schema validation', async () => {
    const csv = generateCsv(30, { invalidEveryN: 5 }); // 20% invalid
    const stateStore = new InMemoryStateStore();
    const config = createConfig({ stateStore, continueOnError: true });

    // Cycle 1
    const imp1 = new BulkImport(config);
    imp1.from(new BufferSource(csv), new CsvParser());
    const r1 = await imp1.processChunk(noop, { maxRecords: 10 });
    const jobId = r1.jobId;

    // Cycle 2
    const imp2 = await BulkImport.restore(jobId, config);
    imp2!.from(new BufferSource(csv), new CsvParser());
    await imp2!.processChunk(noop, { maxRecords: 10 });

    // Cycle 3
    const imp3 = await BulkImport.restore(jobId, config);
    imp3!.from(new BufferSource(csv), new CsvParser());
    const r3 = await imp3!.processChunk(noop);
    expect(r3.done).toBe(true);
    expect(r3.totalProcessed + r3.totalFailed).toBe(30);

    const progress = imp3!.getStatus().progress;
    expect(progress.totalRecords).toBe(30);
    assertProgressInvariant(progress, 'import-3-cycle');
  });

  it('should detect completion when chunk limit coincides with last batch', async () => {
    const csv = generateCsv(10); // exactly 2 batches of 5
    const stateStore = new InMemoryStateStore();
    const config = createConfig({ stateStore, batchSize: 5 });

    // Process all 10 records with maxRecords=10 (exact match)
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());
    const result = await importer.processChunk(noop, { maxRecords: 10 });

    expect(result.done).toBe(true);
    expect(result.processedRecords).toBe(10);
    expect(importer.getStatus().progress.percentage).toBe(100);
  });

  it('should throw when stateStore is not configured', async () => {
    await expect(BulkImport.restore('nonexistent', createConfig())).rejects.toThrow(
      'A stateStore is required to restore a job',
    );
  });

  it('should restore returns null for non-existent job', async () => {
    const stateStore = new InMemoryStateStore();
    const result = await BulkImport.restore('nonexistent', createConfig({ stateStore }));
    expect(result).toBeNull();
  });
});

// ============================================================
// 2. Schema validation edge cases
// ============================================================
describe('Schema validation edge cases', () => {
  it('should handle schema with only optional fields', async () => {
    const config: BulkImportConfig = {
      schema: {
        fields: [
          { name: 'nickname', type: 'string', required: false },
          { name: 'bio', type: 'string', required: false },
        ],
      },
      batchSize: 10,
    };
    const csv = 'nickname,bio\njane,\nalice,hello';
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    const processed: RawRecord[] = [];
    await importer.start(async (record) => {
      await Promise.resolve();
      processed.push(record);
    });

    expect(processed).toHaveLength(2);
    expect(importer.getStatus().status).toBe('COMPLETED');
  });

  it('should handle empty CSV (header only, no records)', async () => {
    const config = createConfig();
    const importer = new BulkImport(config);
    importer.from(new BufferSource('email,name,age'), new CsvParser());

    const processed: RawRecord[] = [];
    await importer.start(async (record) => {
      await Promise.resolve();
      processed.push(record);
    });

    expect(processed).toHaveLength(0);
    expect(importer.getStatus().status).toBe('COMPLETED');
    expect(importer.getStatus().progress.totalRecords).toBe(0);
  });

  it('should handle single record that passes validation', async () => {
    const config = createConfig();
    const importer = new BulkImport(config);
    importer.from(new BufferSource('email,name,age\nuser@test.com,Alice,30'), new CsvParser());

    const processed: RawRecord[] = [];
    await importer.start(async (record) => {
      await Promise.resolve();
      processed.push(record);
    });

    expect(processed).toHaveLength(1);
    const progress = importer.getStatus().progress;
    expect(progress.totalRecords).toBe(1);
    expect(progress.percentage).toBe(100);
    assertProgressInvariant(progress, 'single-record');
  });

  it('should handle single record that fails validation', async () => {
    const config = createConfig({ continueOnError: true });
    const importer = new BulkImport(config);
    importer.from(new BufferSource('email,name,age\nnot-email,Alice,30'), new CsvParser());

    const processed: RawRecord[] = [];
    await importer.start(async (record) => {
      await Promise.resolve();
      processed.push(record);
    });

    expect(processed).toHaveLength(0);
    const failed = await importer.getFailedRecords();
    expect(failed).toHaveLength(1);
    expect(importer.getStatus().progress.percentage).toBe(100);
  });

  it('should reject all records in strict mode with unknown columns', async () => {
    const config: BulkImportConfig = {
      schema: {
        fields: [{ name: 'email', type: 'email', required: true }],
        strict: true,
      },
      batchSize: 10,
      continueOnError: true,
    };
    const csv = 'email,unknown_col\nuser@test.com,extra';
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    await importer.start(noop);

    const failed = await importer.getFailedRecords();
    expect(failed).toHaveLength(1);
    expect(failed[0]!.errors.some((e) => e.code === 'UNKNOWN_FIELD')).toBe(true);
  });
});

// ============================================================
// 3. Progress invariant during import with validation
// ============================================================
describe('Progress invariant during import', () => {
  it('should hold invariant on every progress event with mixed valid/invalid records', async () => {
    const csv = generateCsv(30, { invalidEveryN: 3 });
    const config = createConfig({ continueOnError: true });
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    const progressSnapshots: JobProgress[] = [];
    importer.on('job:progress', (e: JobProgressEvent) => {
      progressSnapshots.push(e.progress);
    });

    await importer.start(noop);

    expect(progressSnapshots.length).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < progressSnapshots.length; i++) {
      assertProgressInvariant(progressSnapshots[i]!, `progress-${String(i)}`);
    }

    const final = importer.getStatus().progress;
    expect(final.percentage).toBe(100);
    expect(final.failedRecords).toBeGreaterThan(0);
    expect(final.processedRecords + final.failedRecords).toBe(30);
  });
});

// ============================================================
// 4. Parser edge cases
// ============================================================
describe('Parser edge cases', () => {
  it('should handle CSV with mismatched column count (extra columns)', async () => {
    const csv = 'email,name,age\nuser@test.com,Alice,30,extra_value';
    const config = createConfig({ continueOnError: true });
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    const processed: RawRecord[] = [];
    await importer.start(async (record) => {
      await Promise.resolve();
      processed.push(record);
    });

    // Should process without crashing (PapaParse handles extra columns)
    expect(importer.getStatus().status).toBe('COMPLETED');
  });

  it('should handle CSV with quoted fields containing commas', async () => {
    const csv = 'email,name,age\nuser@test.com,"Last, First",30';
    const config = createConfig({ continueOnError: true });
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    const processed: RawRecord[] = [];
    await importer.start(async (record) => {
      await Promise.resolve();
      processed.push(record);
    });

    expect(processed).toHaveLength(1);
    expect(processed[0]!.name).toBe('Last, First');
  });

  it('should handle CSV with quoted fields containing newlines', async () => {
    const csv = 'email,name,age\nuser@test.com,"Multi\nLine",30';
    const config = createConfig({ continueOnError: true });
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    const processed: RawRecord[] = [];
    await importer.start(async (record) => {
      await Promise.resolve();
      processed.push(record);
    });

    expect(processed).toHaveLength(1);
  });

  it('should handle completely empty CSV', async () => {
    const config = createConfig();
    const importer = new BulkImport(config);
    importer.from(new BufferSource(''), new CsvParser());

    await importer.start(noop);

    expect(importer.getStatus().status).toBe('COMPLETED');
    expect(importer.getStatus().progress.totalRecords).toBe(0);
  });
});

// ============================================================
// 5. Restore with validation failures
// ============================================================
describe('Restore with validation failures', () => {
  it('should correctly handle restore when some records failed validation', async () => {
    const csv = generateCsv(20, { invalidEveryN: 4 }); // 25% invalid
    const stateStore = new InMemoryStateStore();
    const config = createConfig({ stateStore, continueOnError: true });

    // Process first 10 records
    const imp1 = new BulkImport(config);
    imp1.from(new BufferSource(csv), new CsvParser());
    const r1 = await imp1.processChunk(noop, { maxRecords: 10 });
    const jobId = r1.jobId;
    expect(r1.processedRecords + r1.failedRecords).toBe(10);

    // Restore and complete
    const imp2 = await BulkImport.restore(jobId, config);
    imp2!.from(new BufferSource(csv), new CsvParser());
    const r2 = await imp2!.processChunk(noop);
    expect(r2.done).toBe(true);

    const progress = imp2!.getStatus().progress;
    expect(progress.totalRecords).toBe(20);
    expect(progress.processedRecords + progress.failedRecords).toBe(20);
    assertProgressInvariant(progress, 'restore-with-failures');
  });

  it('should correctly handle restore when all records in first batch failed', async () => {
    // All 5 records in first batch are invalid
    const csv =
      'email,name,age\nbad1,A,1\nbad2,B,2\nbad3,C,3\nbad4,D,4\nbad5,E,5\nuser6@test.com,F,6\nuser7@test.com,G,7\nuser8@test.com,H,8\nuser9@test.com,I,9\nuser10@test.com,J,10';
    const stateStore = new InMemoryStateStore();
    const config = createConfig({ stateStore, continueOnError: true });

    // Process first batch (5 invalid records)
    const imp1 = new BulkImport(config);
    imp1.from(new BufferSource(csv), new CsvParser());
    const r1 = await imp1.processChunk(noop, { maxRecords: 5 });
    const jobId = r1.jobId;
    expect(r1.failedRecords).toBe(5);
    expect(r1.processedRecords).toBe(0);

    // Restore and process second batch (5 valid records)
    const imp2 = await BulkImport.restore(jobId, config);
    imp2!.from(new BufferSource(csv), new CsvParser());
    const r2 = await imp2!.processChunk(noop);
    expect(r2.done).toBe(true);
    expect(r2.totalProcessed).toBe(5);
    expect(r2.totalFailed).toBe(5);

    const progress = imp2!.getStatus().progress;
    expect(progress.percentage).toBe(100);
    assertProgressInvariant(progress, 'all-first-batch-failed');
  });
});

// ============================================================
// 6. DuplicateChecker + restore
// ============================================================
describe('DuplicateChecker with restore', () => {
  it('should apply duplicate checking across restore cycles', async () => {
    const csv = generateCsv(10);
    const stateStore = new InMemoryStateStore();
    const checkedEmails = new Set<string>();

    const config = createConfig({
      stateStore,
      continueOnError: true,
      duplicateChecker: {
        async check(fields: Record<string, unknown>) {
          await Promise.resolve();
          const email = fields['email'] as string;
          if (checkedEmails.has(email)) {
            return { isDuplicate: true, existingId: 'existing-1' };
          }
          checkedEmails.add(email);
          return { isDuplicate: false };
        },
      },
    });

    // Process first 5 records
    const imp1 = new BulkImport(config);
    imp1.from(new BufferSource(csv), new CsvParser());
    const r1 = await imp1.processChunk(noop, { maxRecords: 5 });
    const jobId = r1.jobId;
    expect(r1.processedRecords).toBe(5);

    // Restore and process remaining 5
    const imp2 = await BulkImport.restore(jobId, config);
    imp2!.from(new BufferSource(csv), new CsvParser());
    const r2 = await imp2!.processChunk(noop);
    expect(r2.done).toBe(true);
    expect(r2.totalProcessed).toBe(10);
  });
});

// ============================================================
// 7. Batch boundary precision with BulkImport
// ============================================================
describe('Batch boundary precision', () => {
  it('should handle exact batch boundary (records = N * batchSize)', async () => {
    const csv = generateCsv(20); // exactly 4 batches of 5
    const config = createConfig({ batchSize: 5 });
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    await importer.start(noop);

    const progress = importer.getStatus().progress;
    expect(progress.totalRecords).toBe(20);
    expect(progress.processedRecords).toBe(20);
    expect(progress.totalBatches).toBe(4);
    assertProgressInvariant(progress, 'exact-boundary');
  });

  it('should handle batchSize=1 (one record per batch)', async () => {
    const csv = generateCsv(5);
    const config = createConfig({ batchSize: 1 });
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    await importer.start(noop);

    const progress = importer.getStatus().progress;
    expect(progress.totalRecords).toBe(5);
    expect(progress.totalBatches).toBe(5);
    assertProgressInvariant(progress, 'batch-size-1');
  });

  it('should handle batchSize larger than total records', async () => {
    const csv = generateCsv(3);
    const config = createConfig({ batchSize: 1000 });
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    await importer.start(noop);

    const progress = importer.getStatus().progress;
    expect(progress.totalRecords).toBe(3);
    expect(progress.totalBatches).toBe(1);
    assertProgressInvariant(progress, 'large-batch-size');
  });
});

// ============================================================
// 8. Event consistency
// ============================================================
describe('Event consistency with BulkImport', () => {
  it('should emit job:completed with correct summary after restore', async () => {
    const csv = generateCsv(15);
    const stateStore = new InMemoryStateStore();
    const config = createConfig({ stateStore });

    // Process first 5
    const imp1 = new BulkImport(config);
    imp1.from(new BufferSource(csv), new CsvParser());
    const r1 = await imp1.processChunk(noop, { maxRecords: 5 });
    const jobId = r1.jobId;

    // Restore and complete — capture job:completed
    const imp2 = await BulkImport.restore(jobId, config);
    imp2!.from(new BufferSource(csv), new CsvParser());

    let completedSummary: { total: number; processed: number; failed: number } | null = null;
    imp2!.on('job:completed', (e) => {
      completedSummary = e.summary;
    });

    await imp2!.processChunk(noop);

    expect(completedSummary).not.toBeNull();
    expect(completedSummary!.total).toBe(15);
    expect(completedSummary!.processed).toBe(15);
    expect(completedSummary!.failed).toBe(0);
  });
});

// ============================================================
// 9. Preview edge cases
// ============================================================
describe('Preview edge cases', () => {
  it('should preview empty data source', async () => {
    const config = createConfig();
    const importer = new BulkImport(config);
    importer.from(new BufferSource('email,name,age'), new CsvParser());

    const preview = await importer.preview(10);
    expect(preview.totalSampled).toBe(0);
    expect(preview.validRecords).toHaveLength(0);
    expect(preview.invalidRecords).toHaveLength(0);
  });

  it('should preview with more requested records than available', async () => {
    const csv = generateCsv(3);
    const config = createConfig();
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    const preview = await importer.preview(100);
    expect(preview.totalSampled).toBe(3);
    expect(preview.validRecords).toHaveLength(3);
  });

  it('should preview with mixed valid and invalid records', async () => {
    const csv = generateCsv(10, { invalidEveryN: 2 });
    const config = createConfig();
    const importer = new BulkImport(config);
    importer.from(new BufferSource(csv), new CsvParser());

    const preview = await importer.preview(10);
    expect(preview.validRecords.length + preview.invalidRecords.length).toBe(10);
    expect(preview.invalidRecords.length).toBeGreaterThan(0);
  });
});

// ============================================================
// 10. Stress test
// ============================================================
describe('Stress: large import with restore', () => {
  it('should process 200 records with validation across 4 restore cycles', async () => {
    const csv = generateCsv(200, { invalidEveryN: 10 });
    const stateStore = new InMemoryStateStore();
    const config = createConfig({ stateStore, batchSize: 10, continueOnError: true });

    let jobId: string | null = null;
    for (let cycle = 0; cycle < 4; cycle++) {
      let importer: BulkImport;
      if (jobId) {
        importer = (await BulkImport.restore(jobId, config))!;
      } else {
        importer = new BulkImport(config);
      }
      importer.from(new BufferSource(csv), new CsvParser());

      const result = await importer.processChunk(noop, { maxRecords: 50 });
      jobId = result.jobId;

      const progress = importer.getStatus().progress;
      assertProgressInvariant(progress, `import-stress-cycle-${String(cycle)}`);

      if (result.done) break;
    }

    const finalState = await stateStore.getJobState(jobId!);
    expect(finalState?.totalRecords).toBe(200);
    expect(finalState?.status).toBe('COMPLETED');
  });
});
