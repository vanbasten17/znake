## Why

Run cadence currently triggers boss floors too early, which contradicts the intended runway pacing and causes pressure spikes before players get enough regular-floor buildup. We need a deterministic 9-floor runway with boss/elite milestone on floor 10.

## What Changes

- Set centralized boss cadence interval to `10` so floors `1-9` are regular and floor `10` is boss cadence.
- Preserve deterministic floor setup and progression contracts while updating cadence behavior.
- Add deterministic tests that guard against regression back to early boss cadence.

## Key Points (Codex-style)

- What is changing
  - Boss cadence moves from every 3 floors to every 10 floors.
- Why we are doing it
  - Align actual gameplay behavior with intended runway pacing and fairness.
- Impacted areas
  - `src/game/core/balance.ts`, depth/boss cadence tests, cadence-related spec deltas.
- Risks / unknowns
  - Longer pre-boss runway may require later tuning of non-boss pressure growth.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `gameplay`: refine progression cadence expectation for regular-floor runway and boss milestone timing.
- `balance-config`: refine centralized cadence policy to include deterministic 9-floor runway + floor-10 boss pattern.

## Impact

- Affected code: balance cadence config + deterministic tests.
- No new dependencies.
- No rendering/UI rewrites.
