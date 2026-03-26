## 1. OpenSpec definition

- [x] 1.1 Add proposal, design, tasks, and spec deltas for the feedback-and-juice pass.

## 2. Feedback tuning and hooks

- [x] 2.1 Add centralized feedback timing/intensity config for damage, pickups, and objective completion.
- [x] 2.2 Add reusable runtime feedback helpers/state in `GameScene` for flash, hit-stop, and short emphasis pulses.
- [x] 2.3 Extend shared feedback/audio hooks if needed for distinct pickup/objective cues without introducing a new audio pipeline.

## 3. Gameplay presentation integration

- [x] 3.1 Wire damage moments to clearer hit reactions with bounded flash, shake, and micro-pause behavior.
- [x] 3.2 Wire food, powerup, and biome-item pickups to immediate burst/pulse feedback and readable status emphasis.
- [x] 3.3 Wire room-objective and floor-objective completion to short celebration/reward-ready feedback without obscuring hazards.
- [x] 3.4 Note any remaining scene-local event contract gaps in code comments or implementation summary where a cleaner shared hook is still missing.

## 4. Validation

- [x] 4.1 Run `openspec validate znake-feedback-and-juice-v1`.
- [x] 4.2 Run `pnpm check`.
- [x] 4.3 Run `pnpm build`.
- [ ] 4.4 Manual smoke:
- [ ] damage is readable immediately and feels impactful without feeling sticky
- [ ] pickups are easy to notice and distinguish from passive background motion
- [ ] objective completion and reward-ready moments feel rewarding without cluttering the board
