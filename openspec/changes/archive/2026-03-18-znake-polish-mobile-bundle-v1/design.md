## Context

The game is functionally stable, but load perception and device-edge ergonomics are part of premium UX. Small structural frontend optimizations can produce immediate quality gains.

## Goals / Non-Goals

**Goals:**
- Reduce entry chunk pressure by deferring engine imports.
- Improve spacing on notch/home-indicator phones.
- Keep gameplay behavior unchanged.

**Non-Goals:**
- Deep bundle surgery or replacing Phaser.
- New UX flows or content.

## Decisions

- Use dynamic imports in `main.ts` for Phaser bootstrap modules.
- Add `manualChunks` split for Phaser in Vite build output.
- Use CSS `env(safe-area-inset-*)` to adjust vertical paddings.

## Risks / Trade-offs

- [Risk] Boot errors become asynchronous. -> Mitigation: show explicit load-failed hint.
- [Risk] Safe-area over-padding on non-notched devices. -> Mitigation: `env()` resolves to zero where unsupported.
