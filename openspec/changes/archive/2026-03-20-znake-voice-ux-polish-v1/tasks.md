## 1. Spec

- [x] 1.1 Add `input-hud` delta for voice UX status and command feedback expectations.
- [x] 1.2 Add `scenes` delta for menu voice state visibility behavior.

## 2. Implementation

- [x] 2.1 Extend voice input system with runtime status + accepted/rejected command feedback snapshot.
- [x] 2.2 Surface voice status in menu accessibility row copy (localized).
- [x] 2.3 Show short in-run voice feedback pulse without changing controls/fallback behavior.
- [x] 2.4 Add i18n keys for voice statuses and feedback text.

## 3. Guide

- [x] 3.1 No new playable elements in this change; explicitly keep guide unchanged.

## 4. Validation

- [x] 4.1 Run `openspec validate znake-voice-ux-polish-v1`.
- [x] 4.2 Run `pnpm check`.
- [x] 4.3 Run `pnpm build`.
