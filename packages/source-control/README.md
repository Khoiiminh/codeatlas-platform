# packages/source-control

**Layer:** Adapter (driven)

Implements `SourceControlProvider`: GitHub App installation lifecycle, OAuth, and authorized repository snapshot retrieval for workers.

**May depend on:** `packages/application`, `packages/domain`, GitHub SDKs.

**Must not depend on:** other adapter packages; `apps/*`

**Contains:**
- `src/github/`: GitHub App and OAuth client
- Webhook payload mapping
- Least-privilege token handling

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
