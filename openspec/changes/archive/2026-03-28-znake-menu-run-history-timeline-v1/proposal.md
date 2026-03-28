## Why

Znake has strong telemetry and recap primitives, but players currently lack a lightweight menu memory of recent attempts. A compact run-history timeline in menu closes that learning loop and makes failure-retry decisions faster without touching core simulation rules.

## Key Points (Codex-style)

- What is changing
  - Persist bounded recent run snapshots (seed, floor, death reason, build leaning, preset).
  - Show a compact recent-runs timeline in menu overlay.
- Why we are doing it
  - Improve player learning and replay intent with minimal implementation risk.
- Impacted areas
  - Death scene run-end persistence path, menu overlay presentation, storage constants.
- Risks / unknowns
  - Timeline text density can become noisy on narrow screens; first pass stays compact and capped.

## What Changes

- Add bounded local run-history storage helper.
- Record run summary snapshot at death scene run-end.
- Render top recent run entries in menu with deterministic ordering (newest first).
- Keep implementation presentation-only and avoid gameplay rule changes.

## Capabilities

### New Capabilities

- `run-history-surface`: Player-facing recent-run timeline contract for learning loops.

### Modified Capabilities

- `scenes`: Menu and death scene flow now include run-history persistence and rendering behavior.
- `ui-foundation`: Menu overlay gains a compact history block with readability bounds.

## Impact

- Affected code:
  - `src/game/core/constants.ts`
  - `src/game/core/runHistory.ts` (new)
  - `src/game/scenes/DeathScene.ts`
  - `src/game/scenes/MenuScene.ts`
  - `src/styles/menuOverlay.module.css`
- No new dependencies.
