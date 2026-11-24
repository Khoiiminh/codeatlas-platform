# apps/api

**Layer:** Presentation + composition root

NestJS control plane. Controllers, guards and DTO validation call application use cases. Nest modules wire adapters into ports.

**May depend on:** every package in this workspace.

**Must not depend on:** business rules (they belong in `packages/application` / `packages/domain`); direct database access from controllers

**Contains:**
- `src/bootstrap/`: main.ts, configuration, root module
- `src/modules/<context>/`: controllers, request/response DTOs, Nest module that binds ports to adapters
- `src/common/`: auth guards, tenant-context extraction, error mapping

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
