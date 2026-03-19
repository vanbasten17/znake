## Why

On mobile browsers, WebAudio can remain suspended until a valid user gesture is detected. Some gesture flows do not reliably trigger the current unlock path, causing silent feedback.

## What Changes

- Harden audio unlock by listening to additional gesture events (`touchstart`, `mousedown`, `pointerdown`, `keydown`).
- Remove unlock listeners once audio is confirmed unlocked.

## Capabilities

### Modified Capabilities

- `input-hud`: touch-first sessions reliably unlock feedback audio after first user interaction.

## Impact

- Affected code:
  - `src/game/systems/feedback.ts`
