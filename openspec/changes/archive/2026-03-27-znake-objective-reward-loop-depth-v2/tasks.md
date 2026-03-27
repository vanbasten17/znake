## 1. Objective and reward readability priority

- [x] 1.1 Update objective HUD refresh logic so reward-pending and objective-complete windows prioritize objective-ready messaging over secondary cue concatenation.
- [x] 1.2 Add or update localized copy needed for explicit reward decision framing in the reward flow.

## 2. Reward choice readability polish

- [x] 2.1 Update reward overlay markup to include explicit upside/downside framing labels while preserving existing keyboard/touch pick behavior.
- [x] 2.2 Tune reward overlay styles for stronger card/content contrast and fast scanning without changing the broader HUD shell layout.

## 3. Objective-reward milestone telemetry

- [x] 3.1 Emit a stable `objective_completed` telemetry event when objective completion transitions into reward draft.
- [x] 3.2 Emit a stable `reward_picked` telemetry event when the player confirms a reward choice, including bounded objective-window context.

## 4. Validate

- [x] 4.1 Run `pnpm check` and fix any issues introduced by this change.
