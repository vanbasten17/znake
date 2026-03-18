## 1. Persistent profile foundation

- [x] 1.1 Define versioned profile schema (currency, unlocked talents, lifetime stats).
- [x] 1.2 Implement load/save service with safe defaults and migration guard.
- [x] 1.3 Add tests/validation for profile bootstrap and malformed payload handling.

## 2. Relic draft (run-start) MVP

- [x] 2.1 Define initial relic pool (3 relics minimum) with deterministic apply hooks.
- [x] 2.2 Implement run-start draft UX (pick 1 of 3) between menu and gameplay.
- [x] 2.3 Pass selected relic into game initialization and apply its modifiers.

## 3. Talent tree MVP

- [x] 3.1 Define 6-node talent tree (2 nodes per branch) with costs and prerequisites.
- [x] 3.2 Implement unlock flow with currency checks and profile persistence.
- [x] 3.3 Expose unlock state and effects in menu/meta UI.

## 4. Run-end rewards and summary

- [x] 4.1 Define and implement reward formula from score, kills, and floor.
- [x] 4.2 Update death summary UI with currency earned and new total.
- [x] 4.3 Update lifetime stats on run end and verify persistence.

## 5. Integration and balancing pass

- [x] 5.1 Ensure run config composition order: base -> talents -> relic -> upgrades.
- [x] 5.2 Run balancing pass for first meaningful unlock pacing.
- [x] 5.3 Add telemetry hooks for retention events related to relics and talent spending.
