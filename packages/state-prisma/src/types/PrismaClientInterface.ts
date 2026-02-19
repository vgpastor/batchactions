/**
 * Row types matching the Prisma schema models.
 * These mirror the database tables and are used by the mappers.
 */

export interface BatchactionsJobRow {
  readonly id: string;
  readonly status: string;
  readonly config: unknown;
  readonly batches: unknown;
  readonly totalRecords: number;
  readonly startedAt: bigint | null;
  readonly completedAt: bigint | null;
  readonly distributed: boolean;
}

export interface BatchactionsRecordRow {
  readonly id: number;
  readonly jobId: string;
  readonly batchId: string;
  readonly recordIndex: number;
  readonly status: string;
  readonly raw: unknown;
  readonly parsed: unknown;
  readonly errors: unknown;
  readonly processingError: string | null;
}

export interface BatchactionsBatchRow {
  readonly id: string;
  readonly jobId: string;
  readonly batchIndex: number;
  readonly status: string;
  readonly workerId: string | null;
  readonly claimedAt: bigint | null;
  readonly recordStartIndex: number;
  readonly recordEndIndex: number;
  readonly processedCount: number;
  readonly failedCount: number;
  readonly version: number;
}

/**
 * Minimal Prisma delegate interfaces.
 *
 * These describe the subset of PrismaClient model methods that
 * PrismaStateStore uses. Any PrismaClient generated from a schema
 * that includes the batchactions models will satisfy these interfaces.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface JobDelegate {
  findUnique(args: { where: { id: string } }): Promise<BatchactionsJobRow | null>;
  upsert(args: { where: { id: string }; create: any; update: any }): Promise<BatchactionsJobRow>;
  update(args: { where: { id: string }; data: any }): Promise<BatchactionsJobRow>;
  updateMany(args: { where: any; data: any }): Promise<{ count: number }>;
}

export interface RecordDelegate {
  findMany(args: { where: any; orderBy?: any }): Promise<BatchactionsRecordRow[]>;
  findFirst(args: { where: any }): Promise<BatchactionsRecordRow | null>;
  create(args: { data: any }): Promise<BatchactionsRecordRow>;
  update(args: { where: { id: number }; data: any }): Promise<BatchactionsRecordRow>;
  createMany(args: { data: any[] }): Promise<{ count: number }>;
  groupBy(args: { by: any; where?: any; _count?: any }): Promise<any[]>;
}

export interface BatchDelegate {
  findFirst(args: { where: any; orderBy?: any }): Promise<BatchactionsBatchRow | null>;
  findMany(args: { where: any; orderBy?: any }): Promise<BatchactionsBatchRow[]>;
  update(args: { where: { id: string }; data: any }): Promise<BatchactionsBatchRow>;
  updateMany(args: { where: any; data: any }): Promise<{ count: number }>;
  groupBy(args: { by: any; where?: any; _count?: any }): Promise<any[]>;
}

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Minimal PrismaClient interface for `@batchactions/state-prisma`.
 *
 * Any PrismaClient that has the three `Batchactions*` models defined
 * in its schema will satisfy this interface automatically.
 *
 * Works with both Prisma v6 (`@prisma/client`) and Prisma v7
 * (custom output path) since the CRUD API is identical.
 *
 * @example
 * ```typescript
 * import { PrismaClient } from '@prisma/client';
 * import { PrismaStateStore } from '@batchactions/state-prisma';
 *
 * const prisma = new PrismaClient();
 * const store = new PrismaStateStore(prisma);
 * ```
 */
export interface PrismaBatchactionsClient {
  readonly batchactionsJob: JobDelegate;
  readonly batchactionsRecord: RecordDelegate;
  readonly batchactionsBatch: BatchDelegate;
  $transaction<T>(fn: (tx: PrismaBatchactionsClient) => Promise<T>): Promise<T>;
}
