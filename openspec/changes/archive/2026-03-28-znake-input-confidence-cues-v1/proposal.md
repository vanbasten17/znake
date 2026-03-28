## Why

Players can lose confidence in tight moments when queued input and ability readiness are not explicit. Adding concise confidence cues to the hint channel improves responsiveness readability without introducing new UI complexity.

## Key Points (Codex-style)

- What is changing
  - Add hint-level input confidence cues for queued turns and ability cooldown.
- Why we are doing it
  - Improve clarity and reduce misreads during high-pressure movement.
- Impacted areas
  - `GameScene` hint composition and i18n hint keys.
- Risks / unknowns
  - Too many hint fragments could reduce legibility.

## What Changes

- Append `input buffer` count when turn queue is non-empty.
- Append `ability cooldown` seconds when venom/body-pulse is unavailable.
- Keep cues within existing hint surface and formatting.

## Capabilities

### Modified Capabilities

- `input-hud`: Hint layer conveys immediate input confidence context.
- `gameplay`: Ability readiness state is surfaced as bounded text cues.
- `scenes`: No new overlays; existing hint channel carries confidence cues.

## Impact

- Affected code:
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/i18n.ts`
- No dependency changes.
