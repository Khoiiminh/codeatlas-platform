# packages/application

**Layer:** Application

Use cases and the **ports** they need, one folder per bounded context. NestJS controllers and BullMQ job handlers call these, and nothing else.

**May depend on:** `packages/domain`.

**Must not depend on:** adapter packages, `apps/*`, frameworks, concrete infrastructure, generated engine contracts

**Contains:**
- Use cases, e.g. `ConnectRepository`, `RequestAnalysis`, `CompleteAnalysis`, `AskQuestion`, `ComputeChangeImpact`, `InviteMember`
- Ports, e.g. `WorkspaceRepository`, `AnalysisJobRepository`, `SnapshotStore`, `GraphReader`, `ArtifactStore`, `JobQueue`, `AnalysisEngine`, `LanguageModel`, `SourceControlProvider`, `AccessPolicy`
- Application DTOs and authorization checks (every use case receives an explicit tenant/actor context)
- Each context exposes a public `index.ts`; other contexts import only from it

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
