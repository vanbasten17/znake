## 1. Spec

- [x] 1.1 Add gameplay delta for elimination floors and venom combat loop.
- [x] 1.2 Add input-hud delta for ability trigger input.
- [x] 1.3 Add scenes delta for elimination-mode run clarity.

## 2. Implementation

- [x] 2.1 Extend powerup model with `venom`.
- [x] 2.2 Add elimination-floor behavior (`kills` objective => no food).
- [x] 2.3 Add venom charge collection and manual firing with cooldown.
- [x] 2.4 Add venom projectile update and enemy hit handling.
- [x] 2.5 Add localized status/hint text for venom readiness.
- [x] 2.6 Ensure boss floors expose venom pickup opportunities.
- [x] 2.7 Align boss hit readability with segment-based health reduction.

## 3. Guide

- [x] 3.1 Add venom entry to guide data and i18n (en/ca) with visual marker.

## 4. Validation

- [x] 4.1 Run `openspec validate znake-elimination-run-venom-v1`.
- [x] 4.2 Run `pnpm check`.
- [x] 4.3 Run `pnpm build`.
