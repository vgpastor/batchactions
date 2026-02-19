import type { ProcessedRecord, RawRecord, ValidationError } from '@batchactions/core';
import type { BatchactionsRecordRow } from '../types/PrismaClientInterface.js';
import { parseJson } from '../utils/parseJson.js';

export function toRow(jobId: string, batchId: string, record: ProcessedRecord): Omit<BatchactionsRecordRow, 'id'> {
  return {
    jobId,
    batchId,
    recordIndex: record.index,
    status: record.status,
    raw: JSON.stringify(record.raw),
    parsed: JSON.stringify(record.parsed),
    errors: JSON.stringify(record.errors),
    processingError: record.processingError ?? null,
  };
}

export function toDomain(row: BatchactionsRecordRow): ProcessedRecord {
  const result: ProcessedRecord = {
    index: row.recordIndex,
    raw: parseJson(row.raw) as RawRecord,
    parsed: parseJson(row.parsed) as RawRecord,
    status: row.status as ProcessedRecord['status'],
    errors: parseJson(row.errors) as readonly ValidationError[],
  };

  if (row.processingError !== null) {
    return { ...result, processingError: row.processingError };
  }

  return result;
}
