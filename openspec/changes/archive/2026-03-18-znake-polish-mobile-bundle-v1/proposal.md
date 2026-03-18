## Why

After shipping mobile readiness, we still have two high-value polish gaps:
- initial JS payload is heavy because Phaser boots in the entry chunk
- mobile devices with notches/home-indicators need safer HUD/control spacing

These are low-risk optimizations that improve first-load perception and touch comfort.

## What Changes

- Lazy-load game engine bootstrap from `main.ts` (defer Phaser/scenes loading).
- Configure Vite manual chunking for Phaser vendor split.
- Add safe-area-aware spacing for HUD, controls, and hint bar.

## Capabilities

### Modified Capabilities

- `mobile-readiness`: stronger load-time and device-safe UI behavior.
- `input-hud`: improved touch ergonomics on safe-area devices.

## Impact

- Affected files:
  - `src/main.ts`
  - `vite.config.ts`
  - `src/styles/app.css`
- No gameplay rule changes.
