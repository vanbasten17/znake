## Why

Raises readability and perceived fairness, reducing cheap hits.

## Key Points (Codex-style)

- What is changing
  - Show 1-turn enemy intent cues for major attacks and control effects.
- Why we are doing it
  - Raises readability and perceived fairness, reducing cheap hits.
- Impacted areas
  - Combat readability, enemy roles, HUD cues.
- Risks / unknowns
  - Over-signaling can reduce mastery if all uncertainty disappears.

## What Changes

- Show 1-turn enemy intent cues for major attacks and control effects.
- Define OpenSpec requirements and implementation tasks for Enemy Intent Telegraphs.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- affected spec: enemy-role-taxonomy

## Impact

- Affected code (expected):
  - src/game/
  - src/styles/
  - tests/
- No dependency changes required for proposal stage.
