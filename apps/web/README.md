# apps/web

**Layer:** Presentation (light layering)

Next.js web application. Layering is deliberately light: UI components, then feature hooks/view models, then a typed API client. It talks to `apps/api` over HTTP only.

**May depend on:** `packages/contracts` (types only), its own modules.

**Must not depend on:** `packages/domain`, `packages/application`, adapter packages, databases

**Contains:**
- `src/app/`: routes/layouts
- `src/features/<context>/`: feature components, hooks, view models
- `src/components/`: shared UI
- `src/lib/api-client/`: typed client for `apps/api`

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
