# ADR-0011: Platform Clean Architecture, bounded contexts and package dependency rule
- Status: Proposed
- Date: 2026-11-24
- Decision owners: Platform maintainers
- Repository scope: platform
- Supersedes: none
- Superseded by: none

## Context

`codeatlas-platform` owns the hosted product: users, workspaces, repository connections, hosted analysis orchestration, AI exploration, and later billing (Architecture Blueprint v1.3 §1.2). It contains three deployables (Next.js `web`, NestJS `api`, BullMQ `worker`) that share business rules. It also integrates with many replaceable externals: PostgreSQL/pgvector, R2, Redis/BullMQ, a pinned engine container, LLM providers and GitHub. It is a modular monolith and must stay one, while allowing a context to be extracted later if evidence justifies it.

The initial scaffold had `apps/{api,web,worker}` and `packages/{ai,contracts,database,engine-client,tooling-config}` with no stated dependency direction or domain/application home shared by `api` and `worker`.

## Problem

If business rules live inside NestJS services or job handlers, `api` and `worker` duplicate them. Tenant isolation becomes a scattered concern, and changing an LLM provider, queue or database touches business code. Without context boundaries the monolith turns into a tangle that cannot later be split.

## Decision

Adopt Clean Architecture (Blueprint v1.3 §2) with **bounded contexts** as the primary vertical split:

| Layer | Location |
|---|---|
| Domain | `packages/domain/src/<context>` |
| Application (use cases + ports) | `packages/application/src/<context>` |
| Adapters (driven) | `packages/persistence`, `packages/messaging`, `packages/engine-client`, `packages/ai-providers`, `packages/source-control` |
| Presentation + composition roots | `apps/api` (HTTP), `apps/worker` (jobs); `apps/web` (UI, light layering) |
| Generated contracts | `packages/contracts` (engine contract types; adapter-level only) |

Initial contexts: `identity`, `workspaces`, `repositories`, `analysis`, `exploration`, `shared-kernel`. `billing` is added as a new context when it is introduced.

Rules:

1. Dependencies point inward only. The matrix in [`docs/architecture/README.md`](../architecture/README.md) is normative.
2. Ports are declared in `packages/application`. Only `apps/api` and `apps/worker` bind adapters to ports (Nest modules / worker bootstrap).
3. `packages/domain` and `packages/application` import no framework, ORM, queue, HTTP, LLM SDK or generated contract types.
4. Adapter packages do not import each other. Only `engine-client` imports `packages/contracts`.
5. Contexts interact only through each other's public `index.ts`, never internals or tables.
6. Every use case receives an explicit actor/tenant context. Tenant scoping is enforced in application use cases and again in `persistence` queries (defence in depth).
7. `apps/web` has light layering (UI → feature hooks/view models → typed API client). It calls `apps/api` over HTTP only and never imports domain, application or adapter packages.
8. The platform `analysis` context models jobs and snapshot metadata only. Parsing, graph algorithms and impact computation remain in the engine (ADR-0009).

Scaffold renames: `packages/database` → `packages/persistence`, `packages/ai` → `packages/ai-providers`. New packages: `packages/domain`, `packages/application`, `packages/messaging`, `packages/source-control`. New top-level folders: `infrastructure/`, `tests/{integration,contract,security,architecture}`, `docs/architecture/`.

## Alternatives considered

- **Conventional NestJS layering (controller/service/repository per module inside `apps/api`).** Familiar, but `worker` could not reuse the services without importing the API app. It also tends to couple business logic to Nest decorators and ORMs. Rejected.
- **One package per context (`packages/<context>` containing domain + application).** Stronger isolation per context, but more packages to manage early and no compile-level split between domain and application. Deferred: a context can be promoted to its own package later without changing the rules.
- **Microservices per context.** Contradicts the modular-monolith decision (Blueprint v1.3 §8). Rejected.

## Consequences

- Positive: `api` and `worker` share one implementation of each use case. Adapters (LLM provider, queue, storage) are swappable. Tenant checks have a single home. Contexts can be extracted later. Use cases are testable with in-memory fakes.
- Negative: more packages and an explicit wiring step. New contributors must learn where code goes.
- Mitigation: per-package READMEs, the dependency matrix, boundary checks in CI, and the allowance for direct query ports on trivial reads (Blueprint v1.3 §2.3).

## Implementation and verification

- FND-01: pnpm package manifests whose `dependencies` encode the matrix.
- FND-05: `pnpm check:architecture` as the required CI job `architecture`. It runs two checks: `tests/architecture/check-manifests.ts` against `packages/tooling-config/dependency-matrix.json`, and dependency-cruiser with `packages/tooling-config/dependency-cruiser.cjs`. A deliberately introduced violation must fail CI. Verified on 2026-11-24 with injected probes, all rejected:
  - one forbidden manifest dependency;
  - eight forbidden imports: domain → adapter, cross-context domain, `node:fs` in domain, application deep cross-context, adapter → adapter, `contracts` in a non-engine adapter, web → domain, and worker → api.
- WEB-01 introduces the first context end to end (domain → application → controller) as the reference pattern.
- HOST-02: `packages/persistence` passes the engine's published port behaviour fixtures.
- HOST-03: cross-tenant tests target application use cases and persistence adapters.

## Related records

- Architecture Blueprint v1.3 §1.2, §2, §4
- Traceable Implementation Plan v1.2: FND-01, FND-05, WEB-01, AI-01/02, HOST-01..03
- ADR-0003 (hybrid execution), ADR-0006 (persistence), ADR-0008 (evidence-first AI), ADR-0009 (multi-repository)
- Sibling layering decisions: ADR-0010 (`codeatlas-engine`), ADR-0012 (`codeatlas-vscode`)
