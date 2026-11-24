# Architecture tests

Required CI check `architecture` (FND-05, [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md)): `pnpm check:architecture` runs two checks.

1. **Manifests:** [`check-manifests.ts`](check-manifests.ts) (`pnpm check:manifests`). Every `apps/*` and `packages/*` `package.json` may list only the `@codeatlas/*` packages allowed by [`packages/tooling-config/dependency-matrix.json`](../../packages/tooling-config/dependency-matrix.json). A workspace folder missing from the matrix also fails. It runs on Node's built-in TypeScript support and needs no build step.
2. **Imports:** dependency-cruiser with [`packages/tooling-config/dependency-cruiser.cjs`](../../packages/tooling-config/dependency-cruiser.cjs) (`pnpm check:imports`). Resolved source imports must follow the matrix:
   - domain is innermost, and a domain context imports only itself and `shared-kernel`;
   - application imports only domain, and other contexts only through their `index.ts`;
   - no frameworks, infrastructure SDKs or Node built-ins in domain or application;
   - adapters do not import each other, and only `engine-client` imports `contracts`;
   - apps do not import each other, and `apps/web` imports only `contracts`;
   - no cycles and no unresolvable imports.

Both lists mirror the matrix in [`docs/architecture/README.md`](../../docs/architecture/README.md). Change them together.
