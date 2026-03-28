## Why

Feedback audio/haptics currently use one static mix, which may feel too intense for some players or too muted for others. Introducing selectable profiles improves comfort without changing gameplay logic.

## Key Points (Codex-style)

- What is changing
  - Add audio profile state (`focused`, `balanced`, `low_fatigue`).
  - Add menu control row to cycle audio profile.
  - Scale feedback tone gain/duration and vibration intensity by profile.
- Why we are doing it
  - Improve comfort and personalization for feedback intensity.
- Impacted areas
  - Accessibility settings model, menu accessibility controls, feedback system.
- Risks / unknowns
  - Over-scaling could reduce cue clarity if values are too low.

## What Changes

- Extend accessibility settings with `audioProfile` and cycle helper.
- Add menu accessibility row with profile status labels.
- Apply profile multipliers inside feedback tone/vibration emission path.

## Capabilities

### Modified Capabilities

- `scenes`: Menu exposes selectable audio profile control.
- `ui-foundation`: Feedback system supports bounded audio/haptic intensity profiles.

## Impact

- Affected code:
  - `src/game/systems/accessibility.ts`
  - `src/game/systems/feedback.ts`
  - `src/game/scenes/MenuScene.ts`
  - `src/game/systems/i18n.ts`
- No dependency changes.
