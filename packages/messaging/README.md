# packages/messaging

**Layer:** Adapter (driven)

Implements `JobQueue` with Redis + BullMQ (enqueue, retries, idempotency keys).

**May depend on:** `packages/application`, `packages/domain`, BullMQ/Redis clients.

**Must not depend on:** other adapter packages; `apps/*`

**Contains:**
- Queue producers
- Job payload mapping
- Retry/backoff policy configuration

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
