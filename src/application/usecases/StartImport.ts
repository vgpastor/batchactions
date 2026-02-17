import type { ProcessedRecord } from '../../domain/model/Record.js';
import type { DataSource } from '../../domain/ports/DataSource.js';
import type { SourceParser } from '../../domain/ports/SourceParser.js';
import type { RecordProcessorFn, ProcessingContext } from '../../domain/ports/RecordProcessor.js';
import type { HookContext } from '../../domain/ports/ImportHooks.js';
import type { ValidationError } from '../../domain/model/ValidationResult.js';
import { hasErrors, getWarnings } from '../../domain/model/ValidationResult.js';
import {
  createPendingRecord,
  markRecordValid,
  markRecordInvalid,
  markRecordFailed,
} from '../../domain/model/Record.js';
import { createBatch, clearBatchRecords } from '../../domain/model/Batch.js';
import { BatchSplitter } from '../../domain/services/BatchSplitter.js';
import type { ImportJobContext } from '../ImportJobContext.js';

/** Use case: process all records through the provided callback. */
export class StartImport {
  constructor(private readonly ctx: ImportJobContext) {}

  async execute(processor: RecordProcessorFn): Promise<void> {
    this.ctx.assertSourceConfigured();
    this.assertCanStart();

    this.ctx.transitionTo('PROCESSING');
    this.ctx.abortController = new AbortController();
    this.ctx.startedAt = this.ctx.startedAt ?? Date.now();

    if (this.ctx.completedBatchIndices.size === 0) {
      this.ctx.processedCount = 0;
      this.ctx.failedCount = 0;
      this.ctx.seenUniqueValues = new Map();
      this.ctx.batches = [];
      this.ctx.batchIndexById = new Map();
      this.ctx.totalRecords = 0;
    }

    const source = this.ctx.source;
    const parser = this.ctx.parser;
    if (!source || !parser) {
      throw new Error('Source and parser must be configured. Call .from(source, parser) first.');
    }

    // Yield to next microtask so handlers registered after start() on the same tick receive this event
    await Promise.resolve();

    this.ctx.eventBus.emit({
      type: 'import:started',
      jobId: this.ctx.jobId,
      totalRecords: this.ctx.totalRecords,
      totalBatches: this.ctx.batches.length,
      timestamp: Date.now(),
    });

    try {
      if (this.ctx.maxConcurrentBatches > 1) {
        await this.processWithConcurrency(source, parser, processor);
      } else {
        await this.processSequentially(source, parser, processor);
      }

      if (!this.ctx.abortController.signal.aborted && this.ctx.status !== 'ABORTED') {
        if (this.ctx.chunkExhausted) {
          this.ctx.transitionTo('PAUSED');
        } else {
          this.ctx.transitionTo('COMPLETED');
          const summary = this.ctx.buildSummary();

          this.ctx.eventBus.emit({
            type: 'import:completed',
            jobId: this.ctx.jobId,
            summary,
            timestamp: Date.now(),
          });
        }
      }
    } catch (error) {
      if (this.ctx.status !== 'ABORTED') {
        this.ctx.transitionTo('FAILED');
        this.ctx.eventBus.emit({
          type: 'import:failed',
          jobId: this.ctx.jobId,
          error: error instanceof Error ? error.message : String(error),
          timestamp: Date.now(),
        });
      }
    }

    await this.ctx.saveState();
  }

  private assertCanStart(): void {
    if (this.ctx.status !== 'PREVIEWED' && this.ctx.status !== 'CREATED' && this.ctx.status !== 'PAUSED') {
      throw new Error(`Cannot start import from status '${this.ctx.status}'`);
    }
  }

  private async *streamRecords(source: DataSource, parser: SourceParser): AsyncIterable<ProcessedRecord> {
    let recordIndex = this.ctx.totalRecords;

    for await (const chunk of source.read()) {
      for await (const raw of parser.parse(chunk)) {
        if (this.ctx.abortController?.signal.aborted) return;
        await this.ctx.checkPause();

        yield createPendingRecord(recordIndex, raw);
        recordIndex++;
        this.ctx.totalRecords = recordIndex;
      }
      if (this.ctx.abortController?.signal.aborted) return;
    }
  }

  private async processSequentially(
    source: DataSource,
    parser: SourceParser,
    processor: RecordProcessorFn,
  ): Promise<void> {
    const splitter = new BatchSplitter(this.ctx.batchSize);

    for await (const { records, batchIndex } of splitter.split(this.streamRecords(source, parser))) {
      if (this.ctx.abortController?.signal.aborted || this.ctx.status === 'ABORTED') break;
      if (!this.ctx.completedBatchIndices.has(batchIndex)) {
        await this.processStreamBatch(records, batchIndex, processor);

        if (this.ctx.isChunkExhausted()) {
          this.ctx.chunkExhausted = true;
          break;
        }
      }
    }
  }

  private async processWithConcurrency(
    source: DataSource,
    parser: SourceParser,
    processor: RecordProcessorFn,
  ): Promise<void> {
    const maxConcurrency = this.ctx.maxConcurrentBatches;
    const splitter = new BatchSplitter(this.ctx.batchSize);
    const activeBatches = new Set<Promise<void>>();

    for await (const { records, batchIndex } of splitter.split(this.streamRecords(source, parser))) {
      if (this.ctx.abortController?.signal.aborted || this.ctx.status === 'ABORTED') break;
      if (this.ctx.completedBatchIndices.has(batchIndex)) continue;

      while (activeBatches.size >= maxConcurrency) {
        await Promise.race(activeBatches);
      }

      const batchPromise: Promise<void> = this.processStreamBatch(records, batchIndex, processor).then(() => {
        activeBatches.delete(batchPromise);
      });
      activeBatches.add(batchPromise);

      if (this.ctx.isChunkExhausted()) {
        this.ctx.chunkExhausted = true;
        break;
      }
    }

    await Promise.all([...activeBatches]);
  }

  private async processStreamBatch(
    records: readonly ProcessedRecord[],
    batchIndex: number,
    processor: RecordProcessorFn,
  ): Promise<void> {
    const batchId = crypto.randomUUID();
    const batch = createBatch(batchId, batchIndex, records);
    this.ctx.batchIndexById.set(batchId, this.ctx.batches.length);
    this.ctx.batches.push(batch);

    this.ctx.updateBatchStatus(batchId, 'PROCESSING');
    await this.ctx.stateStore.updateBatchState(this.ctx.jobId, batchId, {
      batchId,
      status: 'PROCESSING',
      processedCount: 0,
      failedCount: 0,
    });

    this.ctx.eventBus.emit({
      type: 'batch:started',
      jobId: this.ctx.jobId,
      batchId,
      batchIndex,
      recordCount: records.length,
      timestamp: Date.now(),
    });

    let processedCount = 0;
    let failedCount = 0;

    for (const record of records) {
      if (this.ctx.abortController?.signal.aborted) break;
      await this.ctx.checkPause();

      if (this.ctx.validator.skipEmptyRows && this.ctx.validator.isEmptyRow(record.raw)) {
        continue;
      }

      const hookCtx: HookContext = {
        jobId: this.ctx.jobId,
        batchId,
        batchIndex,
        recordIndex: record.index,
        totalRecords: this.ctx.totalRecords,
        signal: this.ctx.abortController?.signal ?? new AbortController().signal,
      };

      // --- Hook: beforeValidate ---
      let aliased = this.ctx.validator.resolveAliases(record.raw);
      if (this.ctx.hooks?.beforeValidate) {
        try {
          aliased = await this.ctx.hooks.beforeValidate(aliased, hookCtx);
        } catch (hookError) {
          const errorMsg = hookError instanceof Error ? hookError.message : String(hookError);
          await this.handleRecordFailure(record, batchId, `beforeValidate hook failed: ${errorMsg}`, failedCount);
          this.ctx.failedCount++;
          failedCount++;
          if (!this.ctx.continueOnError) throw new Error(errorMsg);
          this.ctx.chunkRecordCount++;
          continue;
        }
      }

      const transformed = this.ctx.validator.applyTransforms(aliased);
      const validation = this.ctx.validator.validate(transformed);

      const uniqueErrors = this.ctx.validator.hasUniqueFields
        ? this.ctx.validator.validateUniqueness(transformed, this.ctx.seenUniqueValues)
        : [];

      // --- External duplicate check ---
      const externalDupErrors: ValidationError[] = [];
      if (this.ctx.duplicateChecker && validation.errors.length === 0 && uniqueErrors.length === 0) {
        try {
          const dupResult = await this.ctx.duplicateChecker.check(transformed, hookCtx);
          if (dupResult.isDuplicate) {
            externalDupErrors.push({
              field: '_external',
              message: `Duplicate record found${dupResult.existingId ? ` (existing ID: ${dupResult.existingId})` : ''}`,
              code: 'EXTERNAL_DUPLICATE',
              value: undefined,
            });
          }
        } catch (checkerError) {
          const errorMsg = checkerError instanceof Error ? checkerError.message : String(checkerError);
          externalDupErrors.push({
            field: '_external',
            message: `Duplicate check failed: ${errorMsg}`,
            code: 'EXTERNAL_DUPLICATE',
            value: undefined,
          });
        }
      }

      let allErrors = [...validation.errors, ...uniqueErrors, ...externalDupErrors];

      // --- Hook: afterValidate ---
      if (this.ctx.hooks?.afterValidate) {
        try {
          const tempRecord =
            allErrors.length > 0 ? markRecordInvalid(record, allErrors) : markRecordValid(record, transformed);
          const modifiedRecord = await this.ctx.hooks.afterValidate(tempRecord, hookCtx);
          allErrors = [...modifiedRecord.errors];
        } catch (hookError) {
          const errorMsg = hookError instanceof Error ? hookError.message : String(hookError);
          await this.handleRecordFailure(record, batchId, `afterValidate hook failed: ${errorMsg}`, failedCount);
          this.ctx.failedCount++;
          failedCount++;
          if (!this.ctx.continueOnError) throw new Error(errorMsg);
          this.ctx.chunkRecordCount++;
          continue;
        }
      }

      if (hasErrors(allErrors)) {
        const invalidRecord = markRecordInvalid(record, allErrors);
        this.ctx.failedCount++;
        failedCount++;

        await this.ctx.stateStore.saveProcessedRecord(this.ctx.jobId, batchId, invalidRecord);

        this.ctx.eventBus.emit({
          type: 'record:failed',
          jobId: this.ctx.jobId,
          batchId,
          recordIndex: record.index,
          error: allErrors.map((e) => e.message).join('; '),
          record: invalidRecord,
          timestamp: Date.now(),
        });

        if (!this.ctx.continueOnError) {
          throw new Error(`Validation failed for record ${String(record.index)}`);
        }
        this.ctx.chunkRecordCount++;
        continue;
      }

      // Warnings (non-blocking) are preserved on the valid record
      const warnings = getWarnings(allErrors);
      const validRecord = markRecordValid(record, transformed, warnings.length > 0 ? warnings : undefined);
      const context: ProcessingContext = {
        jobId: this.ctx.jobId,
        batchId,
        batchIndex,
        recordIndex: record.index,
        totalRecords: this.ctx.totalRecords,
        signal: this.ctx.abortController?.signal ?? new AbortController().signal,
      };

      // --- Hook: beforeProcess ---
      let parsedForProcessor = validRecord.parsed;
      if (this.ctx.hooks?.beforeProcess) {
        try {
          parsedForProcessor = await this.ctx.hooks.beforeProcess(parsedForProcessor, hookCtx);
        } catch (hookError) {
          const errorMsg = hookError instanceof Error ? hookError.message : String(hookError);
          await this.handleRecordFailure(record, batchId, `beforeProcess hook failed: ${errorMsg}`, failedCount);
          this.ctx.failedCount++;
          failedCount++;
          if (!this.ctx.continueOnError) throw new Error(errorMsg);
          this.ctx.chunkRecordCount++;
          continue;
        }
      }

      const recordForProcessor: ProcessedRecord = { ...validRecord, parsed: parsedForProcessor };
      const result = await this.executeWithRetry(recordForProcessor, context, processor, batchId);

      if (result.success) {
        this.ctx.processedCount++;
        processedCount++;

        const processedRecord: ProcessedRecord = {
          ...recordForProcessor,
          status: 'processed',
          retryCount: result.attempts - 1,
        };

        await this.ctx.stateStore.saveProcessedRecord(this.ctx.jobId, batchId, processedRecord);

        this.ctx.eventBus.emit({
          type: 'record:processed',
          jobId: this.ctx.jobId,
          batchId,
          recordIndex: record.index,
          timestamp: Date.now(),
        });

        // --- Hook: afterProcess ---
        if (this.ctx.hooks?.afterProcess) {
          try {
            await this.ctx.hooks.afterProcess(processedRecord, hookCtx);
          } catch (hookError) {
            const errorMsg = hookError instanceof Error ? hookError.message : String(hookError);
            // Revert: mark as failed since afterProcess hook failed
            this.ctx.processedCount--;
            processedCount--;
            const failedAfterHook = markRecordFailed(recordForProcessor, `afterProcess hook failed: ${errorMsg}`);
            this.ctx.failedCount++;
            failedCount++;
            await this.ctx.stateStore.saveProcessedRecord(this.ctx.jobId, batchId, failedAfterHook);
            this.ctx.eventBus.emit({
              type: 'record:failed',
              jobId: this.ctx.jobId,
              batchId,
              recordIndex: record.index,
              error: errorMsg,
              record: failedAfterHook,
              timestamp: Date.now(),
            });
            if (!this.ctx.continueOnError) throw new Error(errorMsg);
          }
        }

        this.ctx.chunkRecordCount++;
      } else {
        const failedRecord = markRecordFailed(validRecord, result.error);
        const failedWithRetries: ProcessedRecord = { ...failedRecord, retryCount: result.attempts - 1 };
        this.ctx.failedCount++;
        failedCount++;

        await this.ctx.stateStore.saveProcessedRecord(this.ctx.jobId, batchId, failedWithRetries);

        this.ctx.eventBus.emit({
          type: 'record:failed',
          jobId: this.ctx.jobId,
          batchId,
          recordIndex: record.index,
          error: result.error,
          record: failedWithRetries,
          timestamp: Date.now(),
        });

        if (!this.ctx.continueOnError) {
          throw new Error(result.error);
        }
        this.ctx.chunkRecordCount++;
      }
    }

    this.ctx.updateBatchStatus(batchId, 'COMPLETED', processedCount, failedCount);
    this.ctx.completedBatchIndices.add(batchIndex);

    await this.ctx.stateStore.updateBatchState(this.ctx.jobId, batchId, {
      batchId,
      status: 'COMPLETED',
      processedCount,
      failedCount,
    });

    const batchPos = this.ctx.batchIndexById.get(batchId);
    if (batchPos !== undefined) {
      const currentBatch = this.ctx.batches[batchPos];
      if (currentBatch) {
        this.ctx.batches[batchPos] = clearBatchRecords(currentBatch);
      }
    }

    this.ctx.eventBus.emit({
      type: 'batch:completed',
      jobId: this.ctx.jobId,
      batchId,
      batchIndex,
      processedCount,
      failedCount,
      totalCount: records.length,
      timestamp: Date.now(),
    });

    this.ctx.eventBus.emit({
      type: 'import:progress',
      jobId: this.ctx.jobId,
      progress: this.ctx.buildProgress(),
      timestamp: Date.now(),
    });

    await this.ctx.saveState();
  }

  private async executeWithRetry(
    validRecord: ProcessedRecord,
    context: ProcessingContext,
    processor: RecordProcessorFn,
    batchId: string,
  ): Promise<{ success: true; attempts: number } | { success: false; attempts: number; error: string }> {
    const maxAttempts = 1 + this.ctx.maxRetries;
    let lastError = '';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await processor(validRecord.parsed, context);
        return { success: true, attempts: attempt };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        if (attempt < maxAttempts) {
          this.ctx.eventBus.emit({
            type: 'record:retried',
            jobId: this.ctx.jobId,
            batchId,
            recordIndex: validRecord.index,
            attempt,
            maxRetries: this.ctx.maxRetries,
            error: lastError,
            timestamp: Date.now(),
          });

          const delay = this.ctx.retryDelayMs * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    return { success: false, attempts: maxAttempts, error: lastError };
  }

  private async handleRecordFailure(
    record: ProcessedRecord,
    batchId: string,
    errorMsg: string,
    _failedCount: number,
  ): Promise<void> {
    const failedRecord = markRecordFailed(record, errorMsg);
    await this.ctx.stateStore.saveProcessedRecord(this.ctx.jobId, batchId, failedRecord);
    this.ctx.eventBus.emit({
      type: 'record:failed',
      jobId: this.ctx.jobId,
      batchId,
      recordIndex: record.index,
      error: errorMsg,
      record: failedRecord,
      timestamp: Date.now(),
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
