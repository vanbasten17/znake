## Overview

Implement route choice directly in gameplay by turning the portal objective from single-exit to dual-exit.

## Route Model

- Route IDs:
  - `safer`
  - `riskier`
- Selection moment:
  - Player collides with one of the two spawned portals.
- Persistence:
  - Store selected route in `gameState` as a pending floor modifier.
  - Consume once at next `GameScene` floor setup.

## Floor Setup Effects (MVP)

- `safer`:
  - reduce enemy count by 1 (min 1)
  - reduce wall count by 1 (min 1)
  - slightly slower enemies (longer interval)
- `riskier`:
  - increase enemy count by 1
  - increase wall count by 1
  - slightly faster enemies (shorter interval)
  - small immediate score bonus on selection

## UX Cues

- Distinct portal colors:
  - safer = cyan/teal
  - riskier = amber/orange
- HUD/status line uses localized copy indicating the fork choice context.
- Hint text on portal spawn indicates route choice.

## Non-Goals

- No branching map graph yet.
- No menu-level route planner.
- No economy/currency route multipliers in this slice.

## Validation

- `openspec validate znake-dual-portal-choice-v1`
- `pnpm check`
- `pnpm build`
