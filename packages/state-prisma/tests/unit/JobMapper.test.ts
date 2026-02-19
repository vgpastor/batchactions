import { describe, it, expect } from 'vitest';
import * as JobMapper from '../../src/mappers/JobMapper.js';
import type { JobState } from '@batchactions/core';
import type { BatchactionsJobRow } from '../../src/types/PrismaClientInterface.js';

function createJobState(overrides: Partial<JobState> = {}): JobState {
  return {
    id: 'job-1',
    status: 'PROCESSING',
    config: { batchSize: 100 },
    batches: [],
    totalRecords: 50,
    ...overrides,
  };
}

describe('JobMapper', () => {
  describe('toRow', () => {
    it('should serialize a job state to a row', () => {
      const state = createJobState({ startedAt: 1700000000000 });
      const row = JobMapper.toRow(state);

      expect(row.id).toBe('job-1');
      expect(row.status).toBe('PROCESSING');
      expect(row.totalRecords).toBe(50);
      expect(row.startedAt).toBe(BigInt(1700000000000));
      expect(row.completedAt).toBeNull();
      expect(row.distributed).toBe(false);
    });

    it('should strip non-serializable fields from schema config', () => {
      const state = createJobState({
        config: {
          batchSize: 100,
          schema: {
            fields: [
              {
                name: 'email',
                type: 'email',
                required: true,
                customValidator: () => ({ isValid: true, errors: [] }),
                transform: (v: unknown) => v,
                pattern: /test/,
              },
            ],
          },
        },
      });

      const row = JobMapper.toRow(state);
      const config = JSON.parse(row.config as string) as { schema: { fields: Array<Record<string, unknown>> } };
      const field = config.schema.fields[0];

      expect(field).toHaveProperty('name', 'email');
      expect(field).toHaveProperty('type', 'email');
      expect(field).toHaveProperty('required', true);
      expect(field).not.toHaveProperty('customValidator');
      expect(field).not.toHaveProperty('transform');
      expect(field).not.toHaveProperty('pattern');
    });

    it('should preserve serializable field properties', () => {
      const state = createJobState({
        config: {
          batchSize: 100,
          schema: {
            fields: [
              {
                name: 'tags',
                type: 'array',
                required: false,
                separator: ',',
                defaultValue: [],
                aliases: ['tag_list'],
              },
            ],
          },
        },
      });

      const row = JobMapper.toRow(state);
      const config = JSON.parse(row.config as string) as { schema: { fields: Array<Record<string, unknown>> } };
      const field = config.schema.fields[0];

      expect(field).toHaveProperty('separator', ',');
      expect(field).toHaveProperty('defaultValue', []);
      expect(field).toHaveProperty('aliases', ['tag_list']);
    });

    it('should serialize batches without records', () => {
      const state = createJobState({
        batches: [
          {
            id: 'batch-1',
            index: 0,
            status: 'COMPLETED',
            records: [],
            processedCount: 10,
            failedCount: 2,
          },
        ],
      });

      const row = JobMapper.toRow(state);
      const batches = JSON.parse(row.batches as string) as Array<Record<string, unknown>>;

      expect(batches).toHaveLength(1);
      expect(batches[0]).toHaveProperty('id', 'batch-1');
      expect(batches[0]).toHaveProperty('status', 'COMPLETED');
      expect(batches[0]).toHaveProperty('records', []);
    });

    it('should convert timestamps to BigInt', () => {
      const state = createJobState({
        startedAt: 1700000000000,
        completedAt: 1700000060000,
      });

      const row = JobMapper.toRow(state);

      expect(typeof row.startedAt).toBe('bigint');
      expect(typeof row.completedAt).toBe('bigint');
      expect(row.startedAt).toBe(BigInt(1700000000000));
      expect(row.completedAt).toBe(BigInt(1700000060000));
    });

    it('should set distributed flag', () => {
      const state = createJobState({ distributed: true });
      const row = JobMapper.toRow(state);
      expect(row.distributed).toBe(true);
    });
  });

  describe('toDomain', () => {
    it('should reconstruct a job state from a row', () => {
      const row: BatchactionsJobRow = {
        id: 'job-1',
        status: 'PROCESSING',
        config: { batchSize: 100 },
        batches: [],
        totalRecords: 50,
        startedAt: null,
        completedAt: null,
        distributed: false,
      };

      const state = JobMapper.toDomain(row);

      expect(state.id).toBe('job-1');
      expect(state.status).toBe('PROCESSING');
      expect(state.totalRecords).toBe(50);
      expect(state).not.toHaveProperty('startedAt');
      expect(state).not.toHaveProperty('completedAt');
    });

    it('should convert BigInt timestamps to numbers', () => {
      const row: BatchactionsJobRow = {
        id: 'job-1',
        status: 'COMPLETED',
        config: { batchSize: 100 },
        batches: [],
        totalRecords: 50,
        startedAt: BigInt(1700000000000),
        completedAt: BigInt(1700000060000),
        distributed: false,
      };

      const state = JobMapper.toDomain(row);

      expect(state.startedAt).toBe(1700000000000);
      expect(state.completedAt).toBe(1700000060000);
      expect(typeof state.startedAt).toBe('number');
    });

    it('should handle JSON-as-string from SQLite', () => {
      const row: BatchactionsJobRow = {
        id: 'job-1',
        status: 'PROCESSING',
        config: JSON.stringify({ batchSize: 100 }) as unknown,
        batches: JSON.stringify([]) as unknown,
        totalRecords: 50,
        startedAt: null,
        completedAt: null,
        distributed: false,
      };

      const state = JobMapper.toDomain(row);

      expect(state.config).toEqual({ batchSize: 100 });
      expect(state.batches).toEqual([]);
    });

    it('should include distributed flag when true', () => {
      const row: BatchactionsJobRow = {
        id: 'job-1',
        status: 'PROCESSING',
        config: { batchSize: 100 },
        batches: [],
        totalRecords: 0,
        startedAt: null,
        completedAt: null,
        distributed: true,
      };

      const state = JobMapper.toDomain(row);
      expect(state.distributed).toBe(true);
    });

    it('should roundtrip correctly', () => {
      const original = createJobState({
        startedAt: 1700000000000,
        completedAt: 1700000060000,
        distributed: true,
        batches: [
          {
            id: 'batch-1',
            index: 0,
            status: 'COMPLETED',
            records: [],
            processedCount: 10,
            failedCount: 2,
          },
        ],
      });

      const row = JobMapper.toRow(original);
      const restored = JobMapper.toDomain(row);

      expect(restored.id).toBe(original.id);
      expect(restored.status).toBe(original.status);
      expect(restored.totalRecords).toBe(original.totalRecords);
      expect(restored.startedAt).toBe(original.startedAt);
      expect(restored.completedAt).toBe(original.completedAt);
      expect(restored.distributed).toBe(original.distributed);
      expect(restored.batches).toHaveLength(1);
    });
  });
});
