# apps/worker

**Layer:** Presentation + composition root

Background job handlers (BullMQ consumers). Each handler maps a job payload to an application use case.

**May depend on:** every package in this workspace.

**Must not depend on:** business rules; engine algorithms

**Contains:**
- `src/bootstrap/`: worker startup, wiring
- `src/jobs/analysis/`: run pinned engine, publish snapshot
- `src/jobs/repositories/`: installation sync
- `src/jobs/exploration/`: embedding/indexing jobs (when justified)

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
