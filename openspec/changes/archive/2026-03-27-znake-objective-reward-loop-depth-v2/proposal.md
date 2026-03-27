## Why

Objective completion and reward drafting already exist, but moment-to-moment readability still dips during high-pressure rooms: objective messaging competes with secondary cues, and reward decisions can feel visually busy instead of quickly legible. This v2 pass improves clarity and decision framing without changing core objective archetypes or adding a large HUD redesign.

## Key Points (Codex-style)

- **What is changing**
  - Objective HUD messaging gets tighter priority around objective completion and reward-pending windows.
  - Reward-choice presentation gets clearer contrast and explicit framing for upside vs downside reading.
  - Telemetry gains explicit objective-completed and reward-picked events aligned to player-visible decision moments.
- **Why we are doing it**
  - Reduce cognitive load during combat transitions and improve the fairness/readability of post-objective choices.
  - Make reward decisions faster to parse on both keyboard and touch.
  - Improve balancing analytics with cleaner milestone events.
- **Impacted areas**
  - `GameScene` objective/reward flow, DOM HUD text priority, reward overlay copy/styling, telemetry emits.
  - OpenSpec capabilities: `objective-reward-loop`, `input-hud`, `observability`.
- **Risks / unknowns**
  - Over-emphasizing reward state could suppress useful secondary cues if timing is too aggressive.
  - Visual contrast adjustments must stay readable across accessibility presets.
  - Telemetry event growth must stay bounded and stable.

## What Changes

- Prioritize objective HUD messaging so objective-complete and reward-pending states remain immediately readable.
- Add explicit reward decision framing copy and clearer upside/downside labeling in reward choices.
- Improve reward card contrast/readability with focused CSS tuning rather than shell-level redesign.
- Emit deterministic telemetry at objective completion and reward pick moments with stable payload fields.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `objective-reward-loop`: tighten objective-complete to reward-pending readability contract and add explicit completion/pick moment instrumentation expectations.
- `input-hud`: strengthen objective/reward message priority and reward decision framing/readability requirements.
- `observability`: require stable `objective_completed` and `reward_picked` event emissions with bounded context.

## Impact

- Affected code:
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/i18n.ts`
  - `src/styles/rewardOverlay.module.css`
- No new dependencies.
- No deterministic simulation rule changes; this is presentation/telemetry alignment over existing objective/reward flow.
