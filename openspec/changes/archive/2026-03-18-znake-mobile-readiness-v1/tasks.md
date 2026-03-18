## 1. Lifecycle resilience

- [x] 1.1 Add lifecycle system to pause gameplay when app is backgrounded.
- [x] 1.2 Resume gameplay only when lifecycle caused the pause.
- [x] 1.3 Flush profile persistence on visibility/page transitions.

## 2. Mobile interaction feedback

- [x] 2.1 Add best-effort haptic feedback integration.
- [x] 2.2 Add lightweight audio feedback with lazy unlock.
- [x] 2.3 Hook feedback into key input and scene actions.

## 3. Persistence and packaging baseline

- [x] 3.1 Add profile backup key and fallback loading strategy.
- [x] 3.2 Add minimal web manifest and metadata wiring.
- [x] 3.3 Configure explicit 60 FPS target.

## 4. Validation

- [x] 4.1 Validate OpenSpec change.
- [x] 4.2 Run `biome`, `tsc --noEmit`, and `build`.
