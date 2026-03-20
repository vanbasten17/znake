## Why

Combat deaths are currently binary in many enemy-contact situations. Tail-as-health increases recoverability and decision depth while keeping classic wall/self lethality.

## What Changes

- Add tail-segment damage model for enemy contact:
  - enemy head contact: higher segment damage
  - enemy body contact: lower segment damage
- Keep wall/self collisions as instant lethal.
- Keep shield as first defensive layer; if no shield, segment damage is applied.
- Surface minimal readable feedback for segment-loss damage.

## Impact

- Affected specs:
  - `gameplay`
- Affected runtime:
  - `GameScene` enemy collision resolution
  - run-status/hint feedback for damage events
