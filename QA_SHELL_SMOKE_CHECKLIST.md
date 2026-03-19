# Znake Shell Transition Smoke Checklist

Use this quick checklist after UI-shell or scene-flow changes.

## Devices

- Mobile touch device (or browser emulation with touch + portrait)
- Desktop keyboard device

## Core flow checks

- Launch app to Menu:
  - No black strip/desync between game area and controls
  - HUD and controls are aligned with shell edges
- Start run from Menu:
  - Transition to Relic Draft without vertical jump
  - No stale movement/pause/start input carried into destination scene
- Pick relic:
  - Transition to Game immediately, no frozen overlay
- Reach floor clear condition:
  - Transition to Upgrade with interactive cards
  - Picking card transitions back to Game without hidden background input artifacts
- Die in run:
  - Transition to Death overlay with both actions responsive
  - `Next Run` and `Main Menu` both work repeatedly across multiple runs

## Input checks

- Touch mode:
  - D-pad + Start/Pause behave correctly in run scene
  - Menu/relic/upgrade/death taps do not trigger unintended snake movement later
- Keyboard mode:
  - Arrow/WASD move only in run scene
  - Numeric shortcuts work in menu/relic/upgrade
  - Enter/Space actions work in menu/death only where expected

## Lifecycle checks

- Background app (tab hidden / app blur) during run:
  - Game auto-pauses
  - Returns safely on focus
- Repeat full loop 3 times:
  - Menu -> Relic -> Game -> Upgrade -> Game -> Death -> Menu
  - No layout drift accumulation between loops
