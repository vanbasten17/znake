## Why

Supports mastery players while preserving baseline accessibility.

## Key Points (Codex-style)

- What is changing
  - Add deterministic heat-tier mutator stack resolution layered on preset forced mutator context.
- Why we are doing it
  - Enables higher-skill challenge scaling without destabilizing baseline preset behavior.
- Impacted areas
  - Challenge preset resolver, mutator stacking rules, test coverage.
- Risks / unknowns
  - Tiered stacking may over-concentrate pressure if not balanced with progression pacing.

## What Changes

- Add bounded heat-tier clamp and deterministic mutator-stack resolver.
- Add deterministic tests for clamp and stack rotation behavior.
- Keep base preset resolution unchanged when heat tier is zero.

## Capabilities

### Modified Capabilities

- affected spec: challenge-presets

## Impact

- Affected code:
  - src/game/core/challengePresets.ts
  - tests/heat-tier-difficulty-ladder.test.ts
