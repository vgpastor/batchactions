import type { RawRecord, ProcessedRecord, ParsedRecord } from '../model/Record.js';

/** Context passed to lifecycle hook functions. */
export interface HookContext {
  /** Unique job identifier. */
  readonly jobId: string;
  /** Unique batch identifier. */
  readonly batchId: string;
  /** Zero-based batch index. */
  readonly batchIndex: number;
  /** Zero-based record index within the entire import. */
  readonly recordIndex: number;
  /** Total records parsed so far (may grow during streaming). */
  readonly totalRecords: number;
  /** Abort signal for cancellation detection. */
  readonly signal: AbortSignal;
}

/**
 * Lifecycle hooks for intercepting the record processing pipeline.
 *
 * All hooks are optional. If a hook throws, the record is marked as failed
 * (same behavior as a failing processor callback).
 *
 * Pipeline order:
 * 1. Parse raw record
 * 2. Resolve column aliases
 * 3. **`beforeValidate`** — modify raw data before validation (e.g. data enrichment)
 * 4. Apply transforms
 * 5. Schema validation
 * 6. Uniqueness check
 * 7. **`afterValidate`** — inspect/modify the processed record after validation
 * 8. **`beforeProcess`** — modify parsed data before the processor callback
 * 9. Processor callback
 * 10. **`afterProcess`** — trigger side effects after successful processing
 */
export interface ImportHooks {
  /** Called after alias resolution, before transforms and validation. Can modify the raw record. */
  beforeValidate?: (record: RawRecord, context: HookContext) => Promise<RawRecord>;
  /** Called after validation. Can inspect or modify the processed record (e.g. downgrade errors). */
  afterValidate?: (record: ProcessedRecord, context: HookContext) => Promise<ProcessedRecord>;
  /** Called before the processor callback. Can modify the parsed data. */
  beforeProcess?: (record: ParsedRecord, context: HookContext) => Promise<ParsedRecord>;
  /** Called after the processor callback succeeds. For side effects (e.g. audit logging, related entities). */
  afterProcess?: (record: ProcessedRecord, context: HookContext) => Promise<void>;
}
