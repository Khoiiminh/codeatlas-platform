# packages/domain

**Layer:** Domain

Entities, value objects and domain rules of the hosted product, one folder per bounded context: `shared-kernel`, `identity`, `workspaces`, `repositories`, `analysis`, `exploration`.

**May depend on:** nothing in this workspace; only small pure utility libraries.

**Must not depend on:** every other workspace package; NestJS, Next.js, Prisma/ORMs, Redis/BullMQ, HTTP clients, LLM SDKs, generated engine contracts

**Contains:**
- `identity/`: User, Session, credential-free identity rules
- `workspaces/`: Workspace, Membership, Role, permission rules, tenant boundary
- `repositories/`: RepositoryConnection, Installation lifecycle states
- `analysis/`: AnalysisJob state machine, SnapshotRef (metadata only; **no parsing or graph algorithms**, which belong to the engine)
- `exploration/`: Question, Answer, Citation and grounding rules
- `shared-kernel/`: IDs, TenantId, Result/DomainError, Clock interface (kept deliberately small)

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
