# CodeAtlas Platform

The hosted CodeAtlas developer intelligence platform.

Responsibilities:
- Next.js web application
- NestJS API and control plane
- Hosted analysis orchestration
- Background workers
- AI-powered codebase exploration
- Hosted persistence and infrastructure

## Architecture

The platform is a modular monolith that follows Clean Architecture, split into bounded contexts ([ADR-0011](docs/adr/0011-platform-clean-architecture-bounded-contexts.md)):

```text
apps/
├── web/        Next.js UI (light layering; HTTP to api only)
├── api/        NestJS controllers + composition root
└── worker/     BullMQ job handlers + composition root
packages/
├── domain/         entities + rules, per context
├── application/    use cases + ports, per context
├── persistence/    PostgreSQL, pgvector, R2 adapters
├── messaging/      Redis/BullMQ adapter
├── engine-client/  pinned engine image adapter
├── ai-providers/   LLM provider adapters
├── source-control/ GitHub App / OAuth adapter
├── contracts/      generated engine contract types
└── tooling-config/ tsconfig base, dependency matrix, boundary rules
infrastructure/  docker, database migrations, redis, storage, deployment
tests/           integration, contract, security, architecture
```

Bounded contexts: `identity`, `workspaces`, `repositories`, `analysis`, `exploration`, `shared-kernel`.

See [`docs/architecture/README.md`](docs/architecture/README.md) for the dependency matrix and conventions.

## Build and checks

pnpm and Node versions are pinned in `package.json` (`packageManager`) and `.node-version`.

```sh
pnpm install
pnpm typecheck
pnpm format:check         # Prettier, 4-space indent (pnpm format fixes it)
pnpm check:architecture   # manifest + import boundary checks (tests/architecture)
```

CI (`.github/workflows/ci.yml`) runs the jobs `typecheck` (which also checks formatting) and `architecture`. Mark both as required in branch protection.

Branches ([ADR-0013](https://github.com/Khoiiminh/codeatlas-engine/blob/development/docs/adr/0013-branch-promotion-and-rule-ownership.md)): work reaches `development` through pull requests. `main` only moves forward to a commit of `development` (a fast-forward push by a maintainer on the `protect-main` bypass list), so both branches share one history. The `source-branch` check in `.github/workflows/branch-policy.yml` fails any pull request into `main` that does not come from this repository's `development`. Make it required in `protect-main` only. `.github/CODEOWNERS` names the owners of the files that define this repository's rules.

## Decision records

See [`docs/adr/`](docs/adr/README.md).
