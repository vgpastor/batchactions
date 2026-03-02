# @batchactions

[![CI](https://github.com/vgpastor/batchactions/actions/workflows/ci.yml/badge.svg)](https://github.com/vgpastor/batchactions/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![npm core](https://img.shields.io/npm/v/@batchactions/core.svg)](https://www.npmjs.com/package/@batchactions/core)
[![npm import](https://img.shields.io/npm/v/@batchactions/import.svg)](https://www.npmjs.com/package/@batchactions/import)
[![npm distributed](https://img.shields.io/npm/v/@batchactions/distributed.svg)](https://www.npmjs.com/package/@batchactions/distributed)
[![npm state-sequelize](https://img.shields.io/npm/v/@batchactions/state-sequelize.svg)](https://www.npmjs.com/package/@batchactions/state-sequelize)
[![npm state-prisma](https://img.shields.io/npm/v/@batchactions/state-prisma.svg)](https://www.npmjs.com/package/@batchactions/state-prisma)

TypeScript libraries for backend-agnostic batch processing: process any collection at scale with validation, concurrency control, pause/resume, and distributed workers.

Use it for data imports, mass notifications, batch API calls, health checks, migrations — anything that processes records one by one at scale.

## Why @batchactions

- Process any data source: files (CSV/JSON/XML), arrays, async iterables, database cursors
- Built-in concurrency control, retries with exponential backoff, and error boundaries per record
- Pause, resume, abort, and restore flows out of the box
- Distributed mode with atomic batch claiming for multi-worker execution
- Rich lifecycle events and hooks for observability and data enrichment
- Schema validation + preview for import-specific workflows
- Pluggable state stores and parsers so you can adapt to existing infrastructure

## Packages

| Package | Purpose | npm |
|---|---|---|
| [`@batchactions/core`](./packages/core/README.md) | Core batch engine, state model, events, sources, and state stores | [npm](https://www.npmjs.com/package/@batchactions/core) |
| [`@batchactions/import`](./packages/import/README.md) | High-level import facade with schema validation + CSV/JSON/XML parsers | [npm](https://www.npmjs.com/package/@batchactions/import) |
| [`@batchactions/distributed`](./packages/distributed/README.md) | Multi-worker orchestration for distributed processing | [npm](https://www.npmjs.com/package/@batchactions/distributed) |
| [`@batchactions/state-sequelize`](./packages/state-sequelize/README.md) | Sequelize adapter for `StateStore` and `DistributedStateStore` | [npm](https://www.npmjs.com/package/@batchactions/state-sequelize) |
| [`@batchactions/state-prisma`](./packages/state-prisma/README.md) | Prisma v6/v7 adapter for `StateStore` and `DistributedStateStore` | [npm](https://www.npmjs.com/package/@batchactions/state-prisma) |

## Install

```bash
npm install @batchactions/core @batchactions/import
```

Add these when needed:

```bash
npm install @batchactions/distributed

# Sequelize state store
npm install @batchactions/state-sequelize sequelize

# Prisma state store
npm install @batchactions/state-prisma
```

## Choose Your Package

- Start with `@batchactions/core` for any batch processing workflow (in-memory data, custom sources, full control)
- Add `@batchactions/import` for CSV/JSON/XML import workflows with schema validation and preview
- Add `@batchactions/distributed` when one process is not enough
- Add `@batchactions/state-sequelize` for SQL-backed state with Sequelize
- Add `@batchactions/state-prisma` for SQL-backed state with Prisma (v6 or v7)

## Quick Start

### Batch processing with in-memory data

Process any collection — database results, API responses, queued items — with concurrency, retries, and full observability:

```typescript
import { BatchEngine } from '@batchactions/core';

const accounts = await db.accounts.findAll({ where: { status: 'active' } });

const engine = new BatchEngine({
  batchSize: 50,
  maxConcurrentBatches: 4,
  continueOnError: true,
  maxRetries: 2,
  retryDelayMs: 1000,
});

engine.fromRecords(accounts);

engine.on('job:progress', (e) => console.log(`${e.progress.percentage}% done`));
engine.on('record:failed', (e) => console.error(`Record ${e.index} failed: ${e.error}`));

await engine.start(async (record) => {
  await messagingGateway.send({
    channel: record.preferredChannel,
    to: record.contactInfo,
    template: 'monthly-report',
  });
});

const status = engine.getStatus();
console.log(`Sent: ${status.progress.processedRecords}, Failed: ${status.progress.failedRecords}`);
```

### CSV import with schema validation

For file-based imports with schema validation and preview:

```typescript
import { BulkImport, CsvParser, BufferSource } from '@batchactions/import';

const importer = new BulkImport({
  schema: {
    fields: [
      { name: 'email', type: 'email', required: true },
      { name: 'name', type: 'string', required: true },
    ],
  },
  batchSize: 500,
  continueOnError: true,
});

importer.from(new BufferSource('email,name\nuser@example.com,Ada'), new CsvParser());

const preview = await importer.preview(10);
console.log(preview.validRecords.length, preview.invalidRecords.length);

await importer.start(async (record) => {
  await db.users.insert(record);
});
```

## Why Not X?

- Use queue-first tools (BullMQ, Agenda, Bree) when your main need is generic background jobs with scheduling and priorities.
- Use `@batchactions` when you need structured batch processing with per-record error tracking, pause/resume, retries, concurrency control, lifecycle events, and optional schema validation — whether for imports, notifications, migrations, or any record-by-record workflow.

## Core Features

- Process any data: in-memory arrays, async iterables, CSV/JSON/XML files, streams, URLs
- Batch processing with configurable size and concurrency (`maxConcurrentBatches`)
- Per-record retries with exponential backoff
- Pause, resume, abort, and restore flows
- Rich lifecycle events (`job:*`, `batch:*`, `record:*`) and hooks
- Schema validation, transforms, and preview (via `@batchactions/import`)
- Serverless-friendly chunk processing (`processChunk`)
- Distributed worker mode with atomic batch claiming
- Pluggable architecture (sources, parsers, state stores)

## Documentation Map

- Root contributing guide: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- GitHub positioning checklist: [`.github/GITHUB_POSITIONING_CHECKLIST.md`](./.github/GITHUB_POSITIONING_CHECKLIST.md)
- Release template: [`.github/RELEASE_TEMPLATE.md`](./.github/RELEASE_TEMPLATE.md)
- End-to-end example: [`examples/basic-csv-import`](./examples/basic-csv-import/README.md)
- `@batchactions/core`: [`packages/core/README.md`](./packages/core/README.md)
- `@batchactions/import`: [`packages/import/README.md`](./packages/import/README.md)
- `@batchactions/distributed`: [`packages/distributed/README.md`](./packages/distributed/README.md)
- `@batchactions/state-sequelize`: [`packages/state-sequelize/README.md`](./packages/state-sequelize/README.md)
- `@batchactions/state-prisma`: [`packages/state-prisma/README.md`](./packages/state-prisma/README.md)

## Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.0 (if using TypeScript)

## License

MIT
