## Context

Existing menu content is feature-complete but visually linear, making key actions less immediately scannable. A lightweight IA cleanup can improve discoverability without changing gameplay systems.

## Key Points (Codex-style)

- What is changing
  - Introduce semantic section grouping and a dedicated play-action cluster.
- Why we are doing it
  - Reduce cognitive load and improve start-path clarity.
- Impacted areas
  - Menu structure, labels, and responsive style tokens.
- Risks / unknowns
  - Additional labels may create slight vertical expansion.

## Goals / Non-Goals

**Goals:**
- Clearly separate start/build/history paths.
- Keep existing run-start logic intact.
- Maintain mobile-friendly readability.

**Non-Goals:**
- Complete menu redesign.
- New gameplay systems.
- New persistence/state flows.

## Decisions

### Decision: Keep existing behavior handlers
- Reuse `startRun` and preset start handlers.
- Rationale: IA-only change with minimal behavioral risk.

### Decision: Add section labels and clustered actions
- Use compact labels and bounded button groups.
- Rationale: high readability gain for low code risk.

## Risks / Trade-offs

- [Risk] Button density on narrow screens. -> Mitigation: bounded text and existing responsive clamp sizes.

## Migration Plan

1. Add section grouping in menu scene.
2. Add labels and challenge start button copy.
3. Add styles for grouped actions.
4. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Revert menu DOM grouping and new style/key additions.
