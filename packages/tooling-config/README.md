# packages/tooling-config

**Layer:** Tooling

Shared TypeScript configuration and the **architecture boundary rules** enforced in required CI (FND-05).

**May depend on:** nothing.

**Must not depend on:** n/a

**Contains:**
- `tsconfig.base.json`: strict base config, extended by every package (`"extends": "@codeatlas/tooling-config/tsconfig.base.json"`)
- `dependency-matrix.json`: machine-readable matrix of allowed `@codeatlas/*` manifest dependencies, checked by `tests/architecture/check-manifests.ts`
- `dependency-cruiser.cjs`: import rules matching the dependency matrix, run by `pnpm check:imports`

ESLint configuration is added here with the first framework code (WEB-01).

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
