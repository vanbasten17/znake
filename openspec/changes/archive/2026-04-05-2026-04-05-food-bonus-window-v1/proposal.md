## Why

Food scoring is currently flat per pickup, so food chains have limited moment-to-moment scoring tension.
We want a deterministic mini-spike that rewards sustained collection without changing movement rules.

## Key Points (Codex-style)

- What is changing
  - Every 5 foods eaten arms a short bonus window where the next food grants extra score.
- Why we are doing it
  - Adds readable scoring spikes and reward cadence while preserving core snake controls.
- Impacted areas
  - Gameplay food scoring logic, run score progression, deterministic tests.
- Risks / unknowns
  - Scoring inflation if bonus magnitude is too high; scene guardrail pressure if implemented inline.

## What Changes

- Add deterministic food bonus-window scoring logic in gameplay/core layer.
- Keep `GameScene` integration orchestration-only (call gameplay resolver, apply returned score delta).
- Add deterministic tests for arm/consume/rearm behavior.

## Capabilities

### Modified Capabilities

- affected spec: gameplay

## Impact

- Affected code (expected):
  - `src/game/core/**`
  - `src/game/scenes/GameScene.ts`
  - `tests/**/*.test.ts`
- No dependency changes.
