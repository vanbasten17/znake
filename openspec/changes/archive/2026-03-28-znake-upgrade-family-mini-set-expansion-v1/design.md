## Context

The current upgrade pool gives clear family contrast but runs can converge quickly once core picks repeat. A mini-set expansion should improve variety without changing drafting architecture.

## Key Points (Codex-style)

- What is changing
  - Expand each family by one curated upgrade with clear tradeoff language.
- Why we are doing it
  - Increase mid-run decision variety and reduce repeated build patterns.
- Impacted areas
  - Upgrade catalog, deterministic draft test expectations, family identity contracts.
- Risks / unknowns
  - Added tempo modifiers may overtune aggro or over-stabilize survival.

## Goals / Non-Goals

**Goals:**
- One meaningful pivot per family.
- No changes to draft algorithm shape.
- Preserve deterministic seed behavior.

**Non-Goals:**
- Full 2-3-per-family expansion (deferred to later iteration).
- New upgrade UI component types.
- Runtime balancing system rewrite.

## Decisions

### Decision: Add exactly one bounded pivot per family for v1
- Keeps change focused and testable.
- Rationale: low-risk first pass with measurable variety gain.

### Decision: Keep tradeoff framing explicit in metadata
- Every new pick includes gameplay + tradeoff + synergy notes.
- Rationale: readability and faster decision-making.

### Decision: Preserve existing draft strategy
- No modifications to `drawUpgradeDraft` selection flow.
- Rationale: maintain deterministic behavior and avoid coupled risk.

## Risks / Trade-offs

- [Risk] Aggro burst stacking overtunes tempo. -> Mitigation: include explicit downside multipliers.
- [Risk] Survival additions could trivialize mistakes. -> Mitigation: pair safety with mild tempo/score tradeoff.

## Migration Plan

1. Add three upgrade definitions (one per family).
2. Update deterministic catalog coverage tests.
3. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Remove the three added definitions and restore previous test expectations.

## Open Questions

- Should the next pass bias draft weighting by run history to reduce repeated family loops?
