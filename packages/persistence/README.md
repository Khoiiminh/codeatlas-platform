# packages/persistence

**Layer:** Adapter (driven)

Implements storage ports with PostgreSQL, pgvector and Cloudflare R2.

**May depend on:** `packages/application`, `packages/domain`, database/storage SDKs.

**Must not depend on:** other adapter packages; `apps/*`

**Contains:**
- `src/postgres/`: repositories, tenant-scoped queries, snapshot/graph persistence
- `src/pgvector/`: `EmbeddingIndex` (when justified)
- `src/r2/`: `ArtifactStore`
- Port behaviour tests using the engine's published `contracts/fixtures`
- Migrations live in `infrastructure/database`

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
