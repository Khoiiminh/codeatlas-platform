# packages/contracts

**Layer:** Adapter support (engine contract artifact)

Pins the engine's canonical contract package and re-exports it as `@codeatlas/contracts` (FND-03). The pinned artifact is `vendor/codeatlas-contracts-0.1.0.tgz`; [`vendor/README.md`](vendor/README.md) records its provenance and how to update it. Types, constants and the JSON Schema all come from `codeatlas-engine`. **There is no hand-written contract code and no schema fork here.**

**May depend on:** the vendored artifact only (installed as `codeatlas-engine-contracts`).

**Imported by:** `packages/engine-client`, `apps/api`, `apps/worker`, and `apps/web` (types only). Never by `packages/domain` or `packages/application`.

**Enforced by:**
- `contracts-only-in-engine-client-and-roots`: only these importers may use `@codeatlas/contracts`.
- `engine-contract-artifact-only-via-contracts`: nobody else imports the vendored artifact directly.

Both are dependency-cruiser rules in `packages/tooling-config/dependency-cruiser.cjs`.

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
