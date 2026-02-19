#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';

const MODELS = `
// ── @batchactions/state-prisma models ──────────────────────────────

model BatchactionsJob {
  id           String  @id @db.VarChar(36)
  status       String  @db.VarChar(20)
  config       Json
  batches      Json    @default("[]")
  totalRecords Int     @default(0)
  startedAt    BigInt?
  completedAt  BigInt?
  distributed  Boolean @default(false)

  @@map("batchactions_jobs")
}

model BatchactionsRecord {
  id              Int     @id @default(autoincrement())
  jobId           String  @db.VarChar(36)
  batchId         String  @db.VarChar(36)
  recordIndex     Int
  status          String  @db.VarChar(10)
  raw             Json
  parsed          Json
  errors          Json    @default("[]")
  processingError String? @db.Text

  @@unique([jobId, recordIndex])
  @@index([jobId, status])
  @@index([jobId, batchId])
  @@map("batchactions_records")
}

model BatchactionsBatch {
  id               String  @id @db.VarChar(36)
  jobId            String  @db.VarChar(36)
  batchIndex       Int
  status           String  @default("PENDING") @db.VarChar(20)
  workerId         String? @db.VarChar(128)
  claimedAt        BigInt?
  recordStartIndex Int     @default(0)
  recordEndIndex   Int     @default(0)
  processedCount   Int     @default(0)
  failedCount      Int     @default(0)
  version          Int     @default(0)

  @@unique([jobId, batchIndex])
  @@index([jobId, status])
  @@map("batchactions_batches")
}
`;

function findSchemaPath(customPath?: string): string | null {
  if (customPath) {
    return fs.existsSync(customPath) ? customPath : null;
  }

  const candidates = ['prisma/schema.prisma', 'schema.prisma'];
  for (const candidate of candidates) {
    const resolved = path.resolve(process.cwd(), candidate);
    if (fs.existsSync(resolved)) return resolved;
  }
  return null;
}

function main(): void {
  const args = process.argv.slice(2);

  if (args[0] !== 'init') {
    console.log('Usage: batchactions-prisma init [--schema=<path>]');
    console.log('');
    console.log('Adds batchactions models to your Prisma schema.');
    process.exit(0);
  }

  let schemaFlag: string | undefined;
  for (const arg of args) {
    if (arg.startsWith('--schema=')) {
      schemaFlag = arg.slice('--schema='.length);
    }
  }

  const schemaPath = findSchemaPath(schemaFlag);

  if (!schemaPath) {
    console.error('Error: Could not find Prisma schema file.');
    console.error('Specify the path: batchactions-prisma init --schema=prisma/schema.prisma');
    process.exit(1);
  }

  const content = fs.readFileSync(schemaPath, 'utf-8');

  if (content.includes('BatchactionsJob')) {
    console.log('Batchactions models already exist in the schema. Nothing to do.');
    process.exit(0);
  }

  fs.appendFileSync(schemaPath, MODELS);

  console.log(`Added batchactions models to ${schemaPath}`);
  console.log('');
  console.log('Next steps:');
  console.log('  npx prisma migrate dev --name add-batchactions');
  console.log('  npx prisma generate');
}

main();
