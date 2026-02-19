/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { PrismaBatchactionsClient } from '../../src/types/PrismaClientInterface.js';

export interface TestClientResult {
  /** PrismaClient cast to our interface for the store. */
  readonly prisma: PrismaBatchactionsClient;
  /** The underlying PrismaClient instance (for direct DB access in tests). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rawPrisma: any;
  readonly dbPath: string;
  readonly cleanup: () => Promise<void>;
}

/**
 * Creates a fresh SQLite database with the batchactions tables
 * and returns a connected PrismaClient for testing.
 *
 * Requires `prisma generate --schema=tests/prisma/schema.prisma` to have
 * been run first (handled by the `pretest` npm script).
 */
export function createTestClient(): TestClientResult {
  const dbPath = path.join(
    os.tmpdir(),
    `batchactions-prisma-test-${String(Date.now())}-${Math.random().toString(36).slice(2)}.sqlite`,
  );
  const dbUrl = `file:${dbPath}`;

  const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');

  // Push schema to create tables (no migration history needed for tests)
  execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: 'pipe',
  });

  // Dynamic import of the generated PrismaClient
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('../generated/prisma/index.js');
  const prisma = new PrismaClient({
    datasources: { db: { url: dbUrl } },
  });

  return {
    prisma: prisma as PrismaBatchactionsClient,
    rawPrisma: prisma,
    dbPath,
    cleanup: async () => {
      await prisma.$disconnect();
      try {
        if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
        if (fs.existsSync(`${dbPath}-journal`)) fs.unlinkSync(`${dbPath}-journal`);
      } catch {
        // ignore cleanup errors
      }
    },
  };
}
