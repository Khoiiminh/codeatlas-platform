# ADR-0008: Evidence-first AI
- Status: Accepted
- Date: 2026-11-25
- Decision owners: Platform maintainers
- Repository scope: platform
- Supersedes: none
- Superseded by: none

## Context

Users want to ask questions such as "what calls this?", "what breaks if I change this file?" and "how does this feature flow?". Language models answer fluently, but they can invent symbols, files and relationships. The engine already produces a graph in which every relationship carries evidence or is explicitly marked unresolved. That evidence model is an engine decision (ADR-0004); this ADR decides only how the platform's AI features use it.

## Problem

An assistant that answers from raw text or model memory gives plausible but unverifiable answers. For architecture and change-impact questions, an unsupported claim is worse than no answer.

## Decision

AI features are **grounded in graph evidence**:

1. **Retrieval tools use graph query capabilities** (symbols, callers, dependencies, impact) through `exploration` application ports. `packages/engine-client` and/or `packages/persistence` (stored hosted snapshots) implement those ports. Results are bounded and carry their evidence (AI-01).
2. Every factual claim in an answer **cites** the source files and ranges, or the graph relationships, that support it.
3. **Uncertainty is surfaced:** unresolved and inferred relationships are labelled as such, and the assistant says so when evidence is missing instead of guessing.
4. **Grounding and citation rules live in the `exploration` application layer.** They are tested with a fake model provider, so they can be evaluated without a real model (ADR-0011).
5. The **model provider is an adapter detail** in `packages/ai-providers`. Swapping providers does not change the grounding rules.
6. LLM calls and provider selection stay **outside the engine** (Blueprint v1.3 §5). Source code is never written to logs.
7. An **evaluation set** measures citation correctness, unsupported claims and uncertainty handling, and is re-run when prompts, tools or providers change.

## Alternatives considered

- **Chat over embeddings of raw source text (plain RAG).** Easy to build, but it has no structural evidence and cannot answer call or impact questions reliably. Rejected as the primary approach; embeddings may supplement retrieval later (pgvector, ADR-0006).
- **A fine-tuned or code-specialized model alone.** Answers go stale as the code changes, are costly, and still cannot cite evidence. Rejected.
- **No AI features.** Gives up a key exploration capability. Rejected; AI is added after the local slice proves the graph.

## Consequences

- Positive: answers are checkable, failures are visible as uncertainty rather than hallucination, and the provider is replaceable.
- Negative: more tool and prompt engineering, plus an evaluation suite to maintain. Answers are limited by graph coverage.
- Mitigation: bounded tools, fake-provider tests, and an evaluation set as a quality gate.

## Implementation and verification

- AI-01: tool tests return bounded results with evidence.
- AI-02: citation audit and evaluation set; uncertainty is surfaced; grounding rules are tested with a fake provider.
- IMP-01: change-impact results distinguish evidence classes and are exposed to authorized users.

## Related records

- Architecture Blueprint v1.3 §1.2, §2.2, §5
- Traceable Implementation Plan v1.2: AI-01, AI-02, IMP-01
- [ADR-0004](https://github.com/Khoiiminh/codeatlas-engine/blob/development/docs/adr/0004-hybrid-analysis-engine.md) (hybrid analysis and evidence), [ADR-0006](https://github.com/Khoiiminh/codeatlas-engine/blob/development/docs/adr/0006-persistence-strategy.md) (persistence), [ADR-0011](0011-platform-clean-architecture-bounded-contexts.md) (platform layering)
