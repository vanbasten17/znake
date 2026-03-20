## Why

Voice controls are functional but current UX gives little confidence about accepted/rejected commands and runtime voice state.

## What Changes

- Add short visual feedback for accepted and rejected voice commands.
- Expose clearer menu-level voice state messaging (listening, unavailable, denied).
- Keep voice optional and preserve keyboard/touch/swipe fallbacks.
- Add i18n copy for new voice UX labels/messages.

## Impact

- Affected specs:
  - `input-hud`
  - `scenes`
- Affected runtime:
  - Voice input system state and events
  - Menu accessibility row status rendering
  - Localized strings for voice UX
