## Why

Znake is already playable on mobile, but production readiness requires stronger session resilience and tactile responsiveness. Without lifecycle handling and persistence hardening, players can lose state or feel unstable behavior when app focus changes.

## What Changes

- Add app lifecycle management to auto-pause gameplay on background and resume safely on foreground.
- Add optional haptic/audio feedback for core mobile interactions.
- Harden profile persistence with backup-key fallback and safer storage writes.
- Add minimal PWA manifest + metadata foundation.
- Set explicit 60 FPS target in engine config.

## Capabilities

### New Capabilities

- `mobile-readiness`: lifecycle pause/resume and feedback systems for production-like mobile behavior.

### Modified Capabilities

- `game-core`: profile persistence fallback/backup behavior.
- `input-hud`: tactile/audio feedback linked to touch controls.
- `scenes`: lifecycle-aware gameplay pause behavior.

## Impact

- Affected files:
  - `src/game/systems/lifecycle.ts` (new)
  - `src/game/systems/feedback.ts` (new)
  - `src/game/core/meta.ts`
  - `src/game/core/constants.ts`
  - `src/game/phaser.ts`
  - `src/main.ts`
  - `src/game/systems/input.ts`
  - scene integration files for feedback hooks
  - `index.html`, `public/manifest.webmanifest`
