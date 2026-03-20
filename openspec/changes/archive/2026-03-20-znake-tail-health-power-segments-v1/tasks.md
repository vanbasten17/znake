## 1. Spec

- [x] 1.1 Add gameplay delta for tail-segment damage on enemy contact.

## 2. Implementation

- [x] 2.1 Add collision hit-part detection (`head` vs `body`) for enemy contact.
- [x] 2.2 Apply segment loss when shield is unavailable.
- [x] 2.3 Keep wall/self behavior unchanged.
- [x] 2.4 Add minimal localized feedback for segment damage.

## 3. Guide

- [x] 3.1 No new playable entities in this slice; guide unchanged.

## 4. Validation

- [x] 4.1 Run `openspec validate znake-tail-health-power-segments-v1`.
- [x] 4.2 Run `pnpm check`.
- [x] 4.3 Run `pnpm build`.
