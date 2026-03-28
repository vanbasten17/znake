## Why

Upgrade families currently have three entries each, which limits identity pivots across longer runs. Adding a mini-set pass (one new pivot per family) increases build variety while keeping deterministic draft flow and bounded power growth.

## Key Points (Codex-style)

- What is changing
  - Add one new upgrade per family (`aggro`, `control`, `survival`).
  - Keep all additions data-driven in the existing catalog.
  - Preserve deterministic draft behavior and no-duplicate guarantees.
- Why we are doing it
  - Improve replayability and build-expression depth with low implementation risk.
- Impacted areas
  - Upgrade catalog data, draft coverage tests, upgrade-family spec contracts.
- Risks / unknowns
  - New effects could create unintended snowball combos.

## What Changes

- Add `blood_rush` (aggro), `lane_lattice` (control), and `aegis_cycle` (survival).
- Keep tradeoff/synergy framing explicit for decision readability.
- Update tests to enforce expanded per-family catalog counts.

## Capabilities

### Modified Capabilities

- `upgrade-identity`: Family mini-set depth expanded with explicit pivots and tradeoffs.
- `gameplay`: Deterministic draft flow consumes a larger bounded upgrade pool.

## Impact

- Affected code:
  - `src/game/core/upgrades.ts`
  - `tests/upgrades.test.ts`
- No dependency changes.
