## Why

Progression controls currently exist across multiple deterministic modules, but they lack one explicit composition contract that callers can consume as a single source of truth. A unified progression-director contract reduces orchestration leakage, clarifies ownership boundaries, and keeps deterministic pacing knobs composable.

## What Changes

- Introduce a unified progression-director capability that deterministically composes biome phase, depth band, pressure budget knobs, encounter role caps, and terrain modifiers.
- Add requirement deltas clarifying ownership: core/config helpers own progression composition, while scene orchestration remains thin.
- Add deterministic tests validating stable outputs for equivalent inputs and bounded interface surface.

## Key Points (Codex-style)

- What is changing
  - We add one cohesive progression-director resolver contract that composes fragmented progression signals into one deterministic payload.
- Why we are doing it
  - To improve maintainability and prevent scene-level duplication while preserving deterministic simulation behavior.
- Impacted areas
  - Core balance/config helper APIs, progression-facing simulation boundaries, deterministic tests.
- Risks / unknowns
  - Contract shape may need future extension; over-constraining first pass could limit future content velocity if not scoped carefully.

## Capabilities

### New Capabilities
- `progression-director`: deterministic composition contract for progression controls across depth, pacing, role caps, and terrain knobs.

### Modified Capabilities
- `gameplay`: clarify that progression composition is resolved in deterministic core helpers and consumed by scene orchestration.
- `enemy-composition-director`: align role-cap and window outputs with unified progression contract boundaries.
- `predator-prey-pacing`: align pressure budget/guardrail knobs with unified progression contract boundaries.
- `balance-config`: clarify centralized ownership of unified progression-director tuning inputs.

## Impact

- Affected code: core balance/progression helper exports and deterministic unit coverage.
- No new dependencies.
- No runtime visual redesign.
