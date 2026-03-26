## 1. Spec and Contract Foundations

- [x] 1.1 Add `body-economy` capability spec and integration deltas for gameplay, balance-config, game-core, and input-hud.
- [x] 1.2 Define deterministic run-config defaults for body spend costs, cooldowns, and minimum spendable length floor.
- [x] 1.3 Define simulation/domain state contract for body spend cooldown and per-objective reward-overclock usage.

## 2. Simulation and Gameplay Integration

- [x] 2.1 Implement pure spend validation/resolution helpers that consume shared body segments and return typed outcomes.
- [x] 2.2 Integrate `body_pulse` resolution through existing gameplay tick flow without introducing scene-owned rules.
- [x] 2.3 Integrate `reward_overclock` into reward draft flow with one-reroll-per-objective guard and deterministic option generation.

## 3. Presentation and Input/HUD

- [x] 3.1 Map body-pulse intent to existing ability input channel and surface blocked-reason feedback when spend is not allowed.
- [x] 3.2 Add HUD readability updates for body spend events, cooldown/availability state, and reward-overclock affordance.
- [x] 3.3 Keep scene responsibilities limited to intent forwarding and feedback rendering.

## 4. Verification and Balancing Pass

- [x] 4.1 Add deterministic tests for spend floor protection, cooldown behavior, and reroll usage limits.
- [x] 4.2 Add deterministic scenario tests for coexistence between enemy damage loss and voluntary spend loss on shared tail segments.
- [ ] 4.3 Run `pnpm build` and `pnpm check`, then perform focused gameplay smoke checks for fairness, readability, and recovery pacing.
