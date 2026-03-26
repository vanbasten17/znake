## Why

Damage, pickups, and objective success currently resolve correctly, but several important moments land with too little emphasis. The player often gets the gameplay result without enough immediate confirmation, which hurts readability, weakens satisfaction, and makes success/failure swings feel flatter than they should.

## Key Points (Codex-style)

### What is changing

- Add event-driven presentation feedback for damage, pickups, and objective completion.
- Introduce lightweight hit-stop, flash, pulse, and celebration rules that stay readable on a busy board.
- Centralize first-pass timing and intensity values so the feedback pass is tunable instead of hardcoded.

### Why we are doing it

- Roguelite readability depends on instant understanding of state changes.
- Players should feel both danger and reward immediately, not only infer them from score or state updates.
- Tunable feedback makes future polish faster without mixing more game feel hacks into scene logic.

### Impacted areas

- `GameScene` event handling and presentation state.
- Shared feedback/audio hooks and HUD text emphasis.
- Central balance config for juice timings and intensities.

### Risks / unknowns

- Too much emphasis can reduce clarity instead of improving it.
- Small hit-stop windows must not make the game feel sticky or inconsistent.
- Some desired feedback moments may expose missing event contracts that should later move out of `GameScene`.

## What Changes

- Add explicit feedback triggers for:
  - damage taken
  - food/powerup/biome item pickups
  - room objective completion and reward-ready moments
  - floor objective completion / reward transition moments
- Add lightweight presentation responses such as:
  - clearer hit flash and impact color response
  - short pickup burst / emphasis pulse
  - tiny tunable micro-pause on meaningful impacts
  - short celebration pulse for objective success
- Keep all first-pass values centralized in balance config for quick iteration.
- Document any feedback moments that still depend on scene-local state rather than a cleaner shared event contract.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `gameplay`: Damage, pickup, and objective-complete moments now expose bounded, readable feedback behavior.
- `scenes`: `GameScene` now coordinates lightweight impact and reward emphasis without owning new gameplay rules.
- `input-hud`: HUD and hint presentation now support short-lived emphasis for meaningful success moments.
- `balance-config`: Central config now governs first-pass feedback timing, intensity, and micro-pause tuning.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/feedback.ts`
  - `src/game/systems/domHud.ts`
  - `src/game/systems/i18n.ts`
- Affected specs:
  - `openspec/specs/gameplay/spec.md`
  - `openspec/specs/scenes/spec.md`
  - `openspec/specs/input-hud/spec.md`
  - `openspec/specs/balance-config/spec.md`
