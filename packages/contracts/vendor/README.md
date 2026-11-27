# Vendored engine contract artifact

| Field | Value |
|---|---|
| File | `codeatlas-contracts-0.1.0.tgz` |
| Package | `@codeatlas/contracts` 0.1.0 (contract 0.1.0, protocol 0.1) |
| Source | `codeatlas-engine`, `packages/contracts` (`npm pack`), from the FND-03 change |
| SHA-256 | `d37f6a1ce91e42e30d515fbb82106dee904998f64a7568c8069c0655c5b71338` |

This is the immutable, versioned contract artifact the platform pins (ADR-0009 rule 2). `packages/contracts/package.json` installs it under the private alias `codeatlas-engine-contracts`, and `src/index.ts` re-exports it as `@codeatlas/contracts`. `pnpm-lock.yaml` records its integrity hash. Never edit the tarball or copy schema files out of it.

**Reproduce:** check out the engine at the same change, then run `cd packages/contracts && npm ci && npm pack`. The tarball is byte-identical: line endings are fixed by `.gitattributes`, and npm uses fixed timestamps.

**Update** (until registry releases arrive with DIST-01):

1. Take the `codeatlas-contracts` artifact from the engine CI run, or `npm pack` it yourself.
2. Put the new `codeatlas-contracts-<version>.tgz` here and delete the old one.
3. Update the `file:` path in `packages/contracts/package.json`, then run `pnpm install`.
4. Update this table, then run `pnpm typecheck` and `pnpm check:architecture`.
