## Why

We already have a strong mobile-first shell, but readability and input accessibility are still limited for some players.

Before expanding gameplay complexity (new item/sprite readability work), we should add a low-risk accessibility MVP that improves:

- visual legibility (larger text, higher contrast),
- sensory comfort (reduced motion/effects),
- alternative control input (voice commands).

## What Changes

- Add an accessibility panel entry point in main menu.
- Add persistent accessibility preferences:
  - high-contrast UI preset,
  - larger UI text preset,
  - reduced visual effects preset.
- Keep visual accessibility presets dark-launched (implemented but hidden in menu for now).
- Add optional voice controls (browser-supported) for core commands:
  - `up`, `down`, `left`, `right`,
  - optional `pause`, `start`.
- Keep keyboard/touch controls as primary and always available fallback.

## Capabilities

### Modified Capabilities

- `scenes`: menu flow exposes and persists accessibility settings.
- `ui-foundation`: tokenized accessibility presets can be applied globally.
- `input-hud`: optional voice commands feed existing virtual input bridge.

## Impact

- Affected code (planned):
  - `src/game/scenes/MenuScene.ts`
  - `src/game/systems/input.ts`
  - `src/game/systems/domHud.ts`
  - `src/game/systems/i18n.ts`
  - `src/styles/tokens.css`
  - `src/styles/app.css`
  - `src/styles/menuOverlay.module.css`
- New code (planned):
  - `src/game/systems/accessibility.ts`
  - `src/game/systems/voiceInput.ts`
- No external dependency required for MVP (browser-native speech API where available).
