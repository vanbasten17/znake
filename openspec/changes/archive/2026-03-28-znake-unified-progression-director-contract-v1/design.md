## Context

Depth-band pressure, role composition, pacing guardrails, and terrain knobs are already deterministic but spread across separate helper calls. Scene orchestration can accidentally duplicate selection logic if composition is not explicit. We need a first-pass contract that composes these pieces without changing runtime behavior semantics.

## Key Points (Codex-style)

- What is changing
  - Add a deterministic resolver returning a unified progression-director payload from existing data-driven knobs.
- Why we are doing it
  - Improve ownership clarity and reduce orchestration drift while preserving determinism.
- Impacted areas
  - Core helper surface (`balance`/progression resolver), tests asserting deterministic boundaries.
- Risks / unknowns
  - If payload is too narrow, future pacing systems may require follow-up additive fields.

## Goals / Non-Goals

**Goals:**
- Keep GameScene orchestration-thin by moving composition to core helper boundary.
- Preserve deterministic behavior with no scene-local random or timing dependence.
- Expose stable contract fields for depth band, biome phase, pressure budget, role window/caps, and terrain modifiers.

**Non-Goals:**
- No new encounter content, enemy archetypes, or UX redesign.
- No broad simulation rewrite.
- No non-deterministic adaptive director behavior.

## Decisions

1. Add a pure progression-director resolver built from existing deterministic config getters.
- Rationale: keeps behavior data-driven and testable without scene coupling.
- Alternative considered: composing in GameScene. Rejected to avoid orchestration bloat.

2. Derive biome phase from depth band through an explicit deterministic mapping.
- Rationale: practical first-pass biome phase signal without introducing extra runtime state machine coupling.
- Alternative considered: sourcing biome phase from scene lifecycle flags. Rejected as orchestration-owned and harder to test.

3. Keep rollout non-invasive by adding contract and tests first, with no broad consumer rewrites.
- Rationale: minimizes regression risk while establishing ownership contract.
- Alternative considered: immediate multi-caller migration. Rejected for scope control.

## Risks / Trade-offs

- [Contract drift] New systems might bypass the unified resolver.
  - Mitigation: codify spec ownership and add deterministic tests on resolver surface.
- [Phase simplification] Depth-band-to-biome-phase mapping is intentionally coarse.
  - Mitigation: keep mapping explicit and extensible with additive follow-ups.
