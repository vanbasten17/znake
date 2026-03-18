## Context

The product plan for mobile readiness focuses on session quality and reliability, not feature expansion. We need pragmatic improvements that reduce disruption when mobile OS lifecycle events occur.

## Goals / Non-Goals

**Goals:**
- Prevent accidental run loss on app backgrounding.
- Improve touch feel with lightweight haptic/audio feedback.
- Reduce persistence failure risk via backup storage key.
- Establish baseline PWA metadata.

**Non-Goals:**
- Native wrapper packaging in this iteration.
- Full offline/service worker strategy.

## Decisions

- Introduce a dedicated lifecycle system attached in `main.ts`.
- Use scene-level pause/resume (`game.scene.pause/resume`) for lifecycle transitions.
- Keep feedback optional and best-effort (safe no-op where unsupported).
- Persist profile to both primary and backup keys, with fallback load order.
- Add a minimal web manifest as packaging groundwork.

## Risks / Trade-offs

- [Risk] Audio APIs can fail before user gesture. -> Mitigation: lazy unlock on pointer/keyboard interaction.
- [Risk] Lifecycle auto-resume could conflict with manual pause intent. -> Mitigation: only auto-resume when auto-paused by lifecycle.
