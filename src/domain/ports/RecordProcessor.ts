import type { RawRecord } from '../model/Record.js';

/** Context passed to the processor callback for each record. */
export interface ProcessingContext {
  /** Unique job identifier. */
  readonly jobId: string;
  /** Unique batch identifier. */
  readonly batchId: string;
  /** Zero-based batch index. */
  readonly batchIndex: number;
  /** Zero-based record index within the entire import. */
  readonly recordIndex: number;
  /** Total number of records parsed so far (may increase during streaming). */
  readonly totalRecords: number;
  /** Abort signal — check `signal.aborted` to detect cancellation. */
  readonly signal: AbortSignal;
}

/**
 * Callback function that processes a single validated record.
 *
 * This is the consumer's entry point — implement your persistence, API calls,
 * or any side effects here. Throw an error to mark the record as failed.
 */
export type RecordProcessorFn = (record: RawRecord, context: ProcessingContext) => Promise<void>;
