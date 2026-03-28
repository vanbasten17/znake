## 1. Spec Alignment

- [x] 1.1 Add `input-hud` and `scenes` spec deltas for localized challenge-share prompt copy with fallback behavior.
- [x] 1.2 Add `challenge-presets` spec delta for URL-safe body normalization compatibility with unchanged integrity checks.

## 2. Apply Implementation

- [x] 2.1 Move challenge-share prompt labels in menu flow to i18n keys with deterministic fallback behavior.
- [x] 2.2 Normalize challenge-share URL-safe body variants (`-`/`_`) before checksum/decode while preserving strict payload validation.
- [x] 2.3 Add deterministic tests for prompt-copy fallback and URL-safe import equivalence path.

## 3. Validation

- [x] 3.1 Run `pnpm check`.
