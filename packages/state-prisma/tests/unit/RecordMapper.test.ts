import { describe, it, expect } from 'vitest';
import * as RecordMapper from '../../src/mappers/RecordMapper.js';
import type { ProcessedRecord } from '@batchactions/core';
import type { BatchactionsRecordRow } from '../../src/types/PrismaClientInterface.js';

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

describe('RecordMapper', () => {
  describe('toRow', () => {
    it('should convert a record to a row', () => {
      const record = createRecord();
      const row = RecordMapper.toRow('job-1', 'batch-1', record);

      expect(row.jobId).toBe('job-1');
      expect(row.batchId).toBe('batch-1');
      expect(row.recordIndex).toBe(0);
      expect(row.status).toBe('processed');
      expect(JSON.parse(row.raw as string)).toEqual({ email: 'test@example.com' });
      expect(row.processingError).toBeNull();
    });

    it('should include processingError when present', () => {
      const record = createRecord({ status: 'failed', processingError: 'DB connection error' });
      const row = RecordMapper.toRow('job-1', 'batch-1', record);

      expect(row.processingError).toBe('DB connection error');
    });

    it('should include validation errors', () => {
      const record = createRecord({
        status: 'invalid',
        errors: [{ field: 'email', message: 'Invalid email', severity: 'error', category: 'format' }],
      });
      const row = RecordMapper.toRow('job-1', 'batch-1', record);

      expect(JSON.parse(row.errors as string)).toHaveLength(1);
    });
  });

  describe('toDomain', () => {
    it('should reconstruct a record from a row', () => {
      const row: BatchactionsRecordRow = {
        id: 1,
        jobId: 'job-1',
        batchId: 'batch-1',
        recordIndex: 5,
        status: 'processed',
        raw: { name: 'Alice' },
        parsed: { name: 'Alice' },
        errors: [],
        processingError: null,
      };

      const record = RecordMapper.toDomain(row);

      expect(record.index).toBe(5);
      expect(record.status).toBe('processed');
      expect(record.raw).toEqual({ name: 'Alice' });
      expect(record).not.toHaveProperty('processingError');
    });

    it('should include processingError when present', () => {
      const row: BatchactionsRecordRow = {
        id: 1,
        jobId: 'job-1',
        batchId: 'batch-1',
        recordIndex: 0,
        status: 'failed',
        raw: {},
        parsed: {},
        errors: [],
        processingError: 'Timeout',
      };

      const record = RecordMapper.toDomain(row);
      expect(record.processingError).toBe('Timeout');
    });

    it('should handle JSON-as-string from SQLite', () => {
      const row: BatchactionsRecordRow = {
        id: 1,
        jobId: 'job-1',
        batchId: 'batch-1',
        recordIndex: 0,
        status: 'processed',
        raw: JSON.stringify({ name: 'Bob' }) as unknown,
        parsed: JSON.stringify({ name: 'Bob' }) as unknown,
        errors: JSON.stringify([]) as unknown,
        processingError: null,
      };

      const record = RecordMapper.toDomain(row);

      expect(record.raw).toEqual({ name: 'Bob' });
      expect(record.parsed).toEqual({ name: 'Bob' });
      expect(record.errors).toEqual([]);
    });

    it('should roundtrip correctly', () => {
      const original = createRecord({
        index: 3,
        status: 'failed',
        processingError: 'Connection refused',
        errors: [{ field: 'id', message: 'Duplicate', severity: 'error', category: 'uniqueness' }],
      });

      const row = RecordMapper.toRow('job-1', 'batch-1', original) as BatchactionsRecordRow;
      const restored = RecordMapper.toDomain({ ...row, id: 1 });

      expect(restored.index).toBe(original.index);
      expect(restored.status).toBe(original.status);
      expect(restored.processingError).toBe(original.processingError);
      expect(restored.errors).toEqual(original.errors);
    });

    it('should preserve pending status', () => {
      const record = createRecord({ status: 'pending' });
      const row = RecordMapper.toRow('job-1', 'batch-1', record) as BatchactionsRecordRow;
      const restored = RecordMapper.toDomain({ ...row, id: 1 });

      expect(restored.status).toBe('pending');
    });
  });
});
