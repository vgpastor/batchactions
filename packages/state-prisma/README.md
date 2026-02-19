# @batchactions/state-prisma

Prisma persistence adapter for [`@batchactions/core`](https://www.npmjs.com/package/@batchactions/core). Implements `StateStore` and `DistributedStateStore` ports for persisting job state, processed records, and distributed batch coordination to any Prisma-supported database.

## Installation

```bash
npm install @batchactions/state-prisma @batchactions/core
```

## Setup

### 1. Add models to your Prisma schema

Use the CLI helper:

```bash
npx batchactions-prisma init
# or specify schema path:
npx batchactions-prisma init --schema=prisma/schema.prisma
```

Or manually copy the models from [`prisma/batchactions.prisma`](./prisma/batchactions.prisma) into your schema.

### 2. Generate and migrate

```bash
npx prisma migrate dev --name add-batchactions
npx prisma generate
```

### 3. Use

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaStateStore } from '@batchactions/state-prisma';
import { BulkImport, CsvParser, BufferSource } from '@batchactions/import';

const prisma = new PrismaClient();
const stateStore = new PrismaStateStore(prisma);

const importer = new BulkImport({
  schema: {
    fields: [
      { name: 'email', type: 'email', required: true },
      { name: 'name', type: 'string', required: true },
    ],
  },
  source: new BufferSource(new CsvParser(), Buffer.from(csvData)),
  stateStore,
  processor: async (record) => {
    // Save to your database
  },
});

await importer.start();
```

## Tables

The adapter creates three tables:

| Table | Description |
|-------|-------------|
| `batchactions_jobs` | Job state, config, batch metadata |
| `batchactions_records` | Individual processed records with status and errors |
| `batchactions_batches` | Distributed batch coordination with optimistic locking |

## Prisma compatibility

Works with both **Prisma v6** and **Prisma v7**. The adapter accepts your PrismaClient via dependency injection and uses the standard CRUD API that is identical across versions.

## Distributed support

Supports multi-worker distributed processing via `DistributedStateStore`:

- Atomic batch claiming with optimistic locking (version column)
- Stale batch recovery via `reclaimStaleBatches()`
- Exactly-once job finalization via `tryFinalizeJob()`

## Limitation

Non-serializable schema fields (`customValidator`, `transform`, `pattern`) are stripped when saving. The consumer must re-inject them when restoring a job.

## License

MIT
