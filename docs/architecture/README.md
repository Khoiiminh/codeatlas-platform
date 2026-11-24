# Platform architecture: Clean Architecture with bounded contexts

Decision record: [ADR-0011](../adr/0011-platform-clean-architecture-bounded-contexts.md). Shared principle: Architecture Blueprint v1.3 §2.

```text
apps/web ─HTTP─> apps/api ──┐        apps/worker ──┐        (presentation + composition roots)
                            v                      v
                    packages/application  (use cases + ports, per context)
                            v
                    packages/domain       (entities + rules, per context)

  adapters implement ports:  persistence · messaging · engine-client · ai-providers · source-control
```

Bounded contexts (same folder names in `packages/domain`, `packages/application`, `apps/api/src/modules`, `apps/web/src/features`): `shared-kernel`, `identity`, `workspaces`, `repositories`, `analysis`, `exploration`.

## Dependency matrix

✔ = allowed; blank = forbidden. Enforced in required CI (FND-05) by `pnpm check:architecture`: manifests against [`dependency-matrix.json`](../../packages/tooling-config/dependency-matrix.json) and imports against [`dependency-cruiser.cjs`](../../packages/tooling-config/dependency-cruiser.cjs). See [`tests/architecture`](../../tests/architecture/README.md). Update those files together with this table.

| Package ↓ may import → | domain | application | adapters | contracts | apps |
|---|:-:|:-:|:-:|:-:|:-:|
| `packages/domain` | (own context + shared-kernel) | | | | |
| `packages/application` | ✔ | (own context; others via public `index.ts`) | | | |
| adapters (`persistence`, `messaging`, `engine-client`, `ai-providers`, `source-control`) | ✔ | ✔ | | `engine-client` only | |
| `packages/contracts` | | | | | |
| `apps/api`, `apps/worker` | ✔ | ✔ | ✔ | ✔ | |
| `apps/web` | | | | ✔ (types) | |

## Rules of thumb

- A new feature starts in `packages/domain` + `packages/application` with in-memory port fakes, then adds adapters and the controller/job handler.
- Every use case takes an explicit actor/tenant context. Tenant scoping is enforced in the application layer **and** in `persistence` queries.
- Cross-context calls go through the other context's public `index.ts`, never its internals or tables.
- Trivial read endpoints may call a query port directly from a controller when no authorization or orchestration is involved. Document such cases in the module.
- New context (for example `billing`): add the same folder in `domain`, `application`, `apps/api/src/modules` and `apps/web/src/features`.
