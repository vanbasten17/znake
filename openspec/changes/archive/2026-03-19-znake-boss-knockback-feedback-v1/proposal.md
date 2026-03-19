## Why

Boss collisions are currently functional but not sufficiently intuitive for players:
- player may consume shield,
- boss may lose one health,
- but feedback can feel ambiguous.

Introducing explicit knockback feedback will make boss combat outcomes understandable and fair-feeling.

## What Changes

- Define boss collision knockback behavior in gameplay spec.
- Clarify shield-vs-boss interaction semantics with explicit readable feedback.
- Keep scope limited to collision readability and immediate response cues.

## Capabilities

### Modified Capabilities

- `gameplay`: boss collision outcomes are communicated with explicit knockback behavior.

## Impact

- Affected code (planned):
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/feedback.ts` (if dedicated cue is added)
