# packages/ai-providers

**Layer:** Adapter (driven)

Implements `LanguageModel` (and later `EmbeddingModel`) ports for concrete LLM providers. Provider choice is configuration, and grounding rules stay in `application/exploration`.

**May depend on:** `packages/application`, `packages/domain`, provider SDKs.

**Must not depend on:** other adapter packages; `apps/*`

**Contains:**
- One module per provider
- Request/response mapping
- Timeouts, rate limiting and cost metadata

See [ADR-0011](../../docs/adr/0011-platform-clean-architecture-bounded-contexts.md) and the [dependency matrix](../../docs/architecture/README.md).
