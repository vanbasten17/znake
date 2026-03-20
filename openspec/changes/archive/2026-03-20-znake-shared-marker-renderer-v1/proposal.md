## Why

Guide marker visuals are currently replicated in `MenuScene` while gameplay visuals are drawn independently in `GameScene`. This creates drift risk and makes it hard to guarantee 1:1 visual consistency.

## What Changes

- Introduce a shared marker renderer module as single source of truth for marker icon primitives.
- Make guide marker canvas rendering consume the shared renderer.
- Make gameplay collectible/powerup icon interiors consume the same shared renderer.
- Keep existing behavior and gameplay rules unchanged.

## Impact

- Improves visual consistency and maintenance.
- Reduces duplicate drawing logic.
- Prepares cleaner migration path toward authored sprite assets later.
