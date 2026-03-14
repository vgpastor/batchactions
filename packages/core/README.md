# @batchactions/core

Core batch processing engine for the `@batchactions` ecosystem.

Use this package when you need low-level control of batch orchestration, state transitions, events, and infrastructure adapters.

## Install

```bash
npm install @batchactions/core
```

## What You Get

- `BatchEngine` for streaming batch execution
- Job lifecycle control: start, pause, resume, abort, process chunk
- Domain events for job, batch, and record progress
- Built-in sources: `BufferSource`, `FilePathSource`, `StreamSource`, `UrlSource`
- Built-in state stores: `InMemoryStateStore`, `FileStateStore`
- Distributed contracts: `DistributedStateStore`, `BatchReservation`, helpers

## Quick Start

```typescript
import { BatchEngine, BufferSource, InMemoryStateStore } from '@batchactions/core';

const engine = new BatchEngine({
  stateStore: new InMemoryStateStore(),
  batchSize: 100,
  maxConcurrentBatches: 2,
  continueOnError: true,
});

engine.from(new BufferSource(JSON.stringify([{ id: 1 }, { id: 2 }])), {
  async *parse(chunk) {
    const rows = JSON.parse(chunk.toString()) as Array<Record<string, unknown>>;
    for (const row of rows) {
      yield row;
    }
  },
});

await engine.start(async (record) => {
  await processRecord(record);
});
```

## In-Memory Records

When your data is already in memory (database results, API responses, etc.), skip the source/parser pipeline entirely:

```typescript
import { BatchEngine } from '@batchactions/core';

const accounts = [
  { id: 'acc-1', channel: 'email', status: 'active' },
  { id: 'acc-2', channel: 'sms', status: 'active' },
];

const engine = new BatchEngine({
  batchSize: 50,
  maxConcurrentBatches: 4,
  continueOnError: true,
  maxRetries: 2,
});

engine.fromRecords(accounts);

await engine.start(async (record) => {
  await healthCheck(record);
});
```

Also works with async generators for lazy evaluation:

```typescript
async function* fetchPages(): AsyncIterable<Record<string, unknown>> {
  let page = 1;
  while (true) {
    const results = await api.getPage(page++);
    if (results.length === 0) break;
    for (const item of results) yield item;
  }
}

engine.fromRecords(fetchPages());
```

## Serverless / Chunked Processing

Use `processChunk()` with `restore()` to process records incrementally across multiple invocations — ideal for serverless environments with execution time limits (AWS Lambda, Vercel Functions, Cloudflare Workers).

### Basic Pattern

```typescript
import { BatchEngine, InMemoryStateStore } from '@batchactions/core';

const stateStore = new InMemoryStateStore(); // or FileStateStore, SequelizeStateStore, etc.

export async function handler(event: { jobId?: string }) {
  let engine: BatchEngine;

  if (event.jobId) {
    // Subsequent invocation: restore from persisted state
    const restored = await BatchEngine.restore(event.jobId, { stateStore, batchSize: 100 });
    if (!restored) throw new Error('Job not found');
    engine = restored;
  } else {
    // First invocation: create a new engine
    engine = new BatchEngine({ stateStore, batchSize: 100, continueOnError: true });
  }

  // The source must be re-fed on every invocation (it will be re-streamed)
  engine.from(source, parser);

  const result = await engine.processChunk(
    async (record) => { await processRecord(record); },
    { maxDurationMs: 25_000 },  // stop before Lambda's 30s timeout
  );

  if (!result.done) {
    // Schedule the next invocation with the job ID
    await scheduleNext({ jobId: result.jobId });
  }

  return { done: result.done, processed: result.totalProcessed };
}
```

### `maxRecords` vs `maxDurationMs`

| Option | When to use | Boundary behavior |
|---|---|---|
| `maxRecords` | Predictable chunk sizes (e.g., "process 500 records per invocation") | Stops after completing the batch that crosses the record limit |
| `maxDurationMs` | Time-limited environments (e.g., "stop before Lambda timeout") | Checks at **batch boundaries** — actual duration may exceed the limit by one batch |

Both options can be combined. The chunk stops when **either** limit is reached.

### Important Notes

- **Re-streaming requirement**: The source must be re-fed on every invocation via `from()` or `fromRecords()`. The engine re-streams from the beginning and skips completed batches automatically.
- **Batch-level boundaries**: Chunk limits are checked between batches, not between records. A batch always completes before the chunk stops. Use a smaller `batchSize` for finer-grained control.
- **Use a persistent StateStore**: `InMemoryStateStore` loses state between process restarts. For production serverless use, pair with `@batchactions/state-sequelize` or `@batchactions/state-prisma`.
- **`done` flag**: The `ChunkResult.done` property reliably indicates whether all records have been processed. Progress metrics (`totalRecords`, `percentage`) may show partial totals until the source has been fully consumed.

## Main Exports

- `BatchEngine`
- `BatchSplitter`
- `EventBus`, `JobContext`
- `JobStatus`, `BatchStatus`
- `BufferSource`, `FilePathSource`, `StreamSource`, `UrlSource`
- `InMemoryStateStore`, `FileStateStore`
- `isDistributedStateStore`

For full typed exports, see `packages/core/src/index.ts`.

## Compatibility

- Node.js >= 20.0.0

## Related Packages

- `@batchactions/import`: high-level import facade
- `@batchactions/distributed`: multi-worker orchestration
- `@batchactions/state-sequelize`: SQL persistence adapter (Sequelize)
- `@batchactions/state-prisma`: SQL persistence adapter (Prisma v6/v7)

## Links

- Repository: https://github.com/vgpastor/batchactions/tree/main/packages/core
- Issues: https://github.com/vgpastor/batchactions/issues
- Contributing guide: https://github.com/vgpastor/batchactions/blob/main/CONTRIBUTING.md

## License

MIT
