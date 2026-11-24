# packages/engine-client

**Layer:** Adapter (driven)

Implements `AnalysisEngine` and engine-backed `GraphReader` operations by invoking the **pinned** engine release/container in an isolated worker.

**May depend on:** `packages/application`, `packages/domain`, `packages/contracts`.

**Must not depend on:** other adapter packages; `apps/*`

**Contains:**
- Engine invocation (container/CLI)
- Contract-to-application mapping
- Engine/contract version recording on every snapshot

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
