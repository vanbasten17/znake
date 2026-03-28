## Context

Route commits are high-pressure moments. To keep deterministic architecture intact, decision support should be computed from existing route-preview metadata in pure helpers and rendered by scene/presentation only.

## Key Points (Codex-style)

- What is changing
  - Introduce deterministic route-choice insight computation and present it as compact card lines + framing cues.
- Why we are doing it
  - Improve route readability, fairness, and confidence without altering gameplay outcomes.
- Impacted areas
  - `GameScene` route overlay composition, route overlay shell, route CSS, route insight tests.
- Risks / unknowns
  - Increased text density may require future responsive tuning.

## Goals / Non-Goals

**Goals:**
- Preserve deterministic simulation boundaries.
- Reuse existing route-preview payload and mastery context.
- Keep implementation minimal and test-backed.

**Non-Goals:**
- No balance, spawn, or path-generation changes.
- No new overlays beyond route overlay enhancements.
- No progression system modifications.

## Decisions

### Decision: Centralize card insight math in simulation helper
- Create `resolveRouteChoiceInsights(choice, currentBiomeId)`.
- Includes risk score/level, pressure delta, elite/recovery counts, depth-band label input, and biome-pivot boolean.

### Decision: Add bounded card lines instead of new widgets
- Show compact lines for pressure, elite ahead, recovery ahead, depth, pivot, and future preview continuation.
- Keep typography and spacing aligned with existing route card styles.

### Decision: Use risk-level visual treatment on cards
- Apply low/medium/high border accents to route cards.
- Include a short legend line in overlay framing to avoid ambiguity.

## Risks / Trade-offs

- [Risk] Too many lines can reduce scan speed.
  - Mitigation: keep one-line labels and small bounded set.

## Migration Plan

1. Add run-map spec delta for deterministic route decision support signals.
2. Implement helper and tests.
3. Wire GameScene route overlay lines and risk classes.
4. Add localization keys and style updates.
5. Validate with `pnpm check`.

Rollback strategy:
- Remove insight rendering and helper usage; keep prior route overlay behavior.
