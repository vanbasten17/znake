## Overview

Implement a lightweight passive pressure loop that rewards consistent feeding and core-item routing without changing scene flow.

## Mechanics

- Activation:
  - enabled via balance config
  - non-boss floors only
  - starts from configured floor threshold
- Loop:
  - pressure timer counts down continuously
  - eating food resets timer
  - timeout event:
    - consume coolant charge first (if available), then reset timer
    - otherwise degrade snake length by configured amount and reset timer
    - if snake is too short, fallback to lethal outcome
- Core item interaction:
  - collecting biome `core` grants coolant charges in addition to current score/growth bonus

## UX

- Run status includes pressure countdown and coolant count (localized).
- Keep warnings subtle (reuse existing feedback cues, no heavy new overlays).

## Non-Goals

- No new item type for coolant in this slice (reuse `core`).
- No economy reward coupling.
- No objective-type branching changes.

## Validation

- `openspec validate znake-core-biome-pressure-v1`
- `pnpm check`
- `pnpm build`
