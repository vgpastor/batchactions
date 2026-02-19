# @batchactions/state-prisma

## 0.0.3

- Initial release
- Implements `StateStore` and `DistributedStateStore` from `@batchactions/core`
- Compatible with Prisma v6 and v7
- CLI helper: `npx batchactions-prisma init` to add models to your schema
- Atomic batch claiming with optimistic locking
- Exactly-once job finalization
- Supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, CockroachDB
