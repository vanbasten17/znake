## Context

This batch combines visual polish, accessibility-informed UI defaults, and internal code cleanup. The design constraint is strict: maintain deterministic simulation behavior while making interface decisions easier to parse under pressure.

## Key Points (Codex-style)

- What is changing
  - Add low-risk UI polish + readability improvements and refactor content-picking helpers.
- Why we are doing it
  - Improve clarity and confidence for players while accelerating future balancing work.
- Impacted areas
  - CSS tokens/modules, route overlay construction, content selection logic, tests.
- Risks / unknowns
  - CSS adjustments can shift perceived density; helper extraction could accidentally change selection behavior.

## Goals / Non-Goals

**Goals:**
- Preserve deterministic runtime outcomes.
- Improve readability on small and touch screens.
- Ensure risk cues are not color-only.
- Reduce duplicated selection logic in content helpers.

**Non-Goals:**
- Rewrite scene architecture.
- Introduce new rendering pipelines.
- Rebalance core progression curves in this pass.

## Decisions

### Decision: Use token-driven readability updates
- Increase minimum text legibility and focus clarity via CSS variables/classes.
- Rationale: keeps changes centralized and reversible.

### Decision: Add textual risk prefixes in route overlay
- Prefix route risk line with bracketed risk labels (low/medium/high).
- Rationale: meets non-color-only readability expectations.

### Decision: Precompute/refactor content helper internals
- Extract pool-kind and weighted-entry helpers.
- Rationale: improves maintainability and testability without altering outputs.

## Risks / Trade-offs

- [Risk] Larger controls can reduce available space on short viewports.
  - Mitigation: keep adjustments modest and use responsive clamps.
- [Risk] Visual changes may over-emphasize overlays.
  - Mitigation: preserve existing hierarchy and only tune contrast/spacing.

## Migration Plan

1. Implement UI token/module deltas.
2. Implement route risk text cue enhancement.
3. Refactor content helper code.
4. Add deterministic tests for content selection.
5. Run `pnpm check` and `pnpm build`.

Rollback strategy:
- Revert this change folder and touched source files; no data migrations required.
