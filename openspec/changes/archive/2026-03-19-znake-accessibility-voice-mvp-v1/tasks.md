## 1. OpenSpec definition

- [x] 1.1 Create proposal/design/tasks for accessibility + voice MVP.
- [x] 1.2 Add spec deltas for scenes, ui-foundation, and input-hud.

## 2. Implementation

- [x] 2.1 Add persistent accessibility settings system (load/save/apply).
- [x] 2.2 Add menu controls to toggle accessibility options.
- [x] 2.3 Add CSS token/class presets for high-contrast + large-text + reduced-effects.
- [x] 2.4 Add optional voice command listener and map commands into virtual input.
- [x] 2.5 Add localized copy for accessibility/voice labels and status states.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-accessibility-voice-mvp-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.
- [ ] 3.4 Manual smoke:
- [ ] menu toggles persist after reload
- [ ] gameplay still works with keyboard/touch
- [ ] voice supported browser: directional commands work
- [ ] unsupported browser: graceful fallback, no runtime errors
