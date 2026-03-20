## Why

Znake already has a strong style, but visual rules are scattered across rendering and scene logic. We need a single system that keeps gameplay readable under pressure, avoids ambiguous signals, and scales when we add new entities/features.

## What Changes

- Define a formal visual language for gameplay entities:
  - shape semantics,
  - color semantics,
  - priority/urgency feedback,
  - state-driven visuals.
- Define strict readability constraints (<1s comprehension, contrast, signal hierarchy).
- Define extensibility contract for adding new entities using data-driven visual tokens.
- Apply a first implementation slice:
  - centralized visual token mapping module,
  - marker semantics wired to this mapping,
  - internal validation command for mapping quality.

## Impact

- Gives product/design/engineering one shared source of truth.
- Reduces regressions and visual inconsistency as gameplay grows.
- Enables faster implementation reviews and cleaner balancing iterations.

## Key Points (Codex-style)

### What is changing

- We introduce explicit gameplay visual-system requirements in OpenSpec (gameplay + UI foundation).

### Why it matters

- Players must parse danger/reward/urgency immediately, especially on mobile and high-density scenes.

### Impacted areas

- `openspec/specs/gameplay/spec.md`
- `openspec/specs/ui-foundation/spec.md`
- Future rendering and content pipelines (markers, enemies, hazards, objectives, telemetry QA checks).

### Risks / unknowns

- Existing visuals may violate new rules and require gradual refactor.
- Some constraints (contrast/motion) need practical thresholds tuned with real-device playtests.
- New enemy/powerup concepts may challenge shape/color uniqueness if mapping governance is not enforced.
