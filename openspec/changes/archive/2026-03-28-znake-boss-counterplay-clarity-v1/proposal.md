## Why

Strengthens boss mastery and reduces opaque deaths.

## Key Points (Codex-style)

- What is changing
  - Define explicit boss counterplay windows and punish loops per phase.
- Why we are doing it
  - Strengthens boss mastery and reduces opaque deaths.
- Impacted areas
  - Boss phase design, combat cadence, UI warnings.
- Risks / unknowns
  - Extra signaling might increase visual clutter during fights.

## What Changes

- Define explicit boss counterplay windows and punish loops per phase.
- Define OpenSpec requirements and implementation tasks for Boss Counterplay Clarity.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- affected spec: boss-encounter-depth

## Impact

- Affected code (expected):
  - src/game/
  - src/styles/
  - tests/
- No dependency changes required for proposal stage.
