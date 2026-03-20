## 1. Spec

- [x] 1.1 Add gameplay delta for floor template selection, room generation behavior, and fallback.
- [x] 1.2 Add balance-config delta for template cadence knobs.
- [x] 1.3 Add observability delta for template selection telemetry.

## 2. Implementation

- [x] 2.1 Extend floor setup/types with `floorTemplate`.
- [x] 2.2 Implement room-template generation with corridor connectivity validation.
- [x] 2.3 Add template fallback to classic generation after bounded retries.
- [x] 2.4 Apply zone-aware spawn rules for food/enemies while keeping fairness.
- [x] 2.5 Emit telemetry event for selected template.

## 3. Guide

- [x] 3.1 No new playable items/talents/hazards/enemies are introduced; guide remains unchanged.

## 4. Validation

- [x] 4.1 Run `openspec validate znake-room-template-generator-v1`.
- [x] 4.2 Run `pnpm check`.
- [x] 4.3 Run `pnpm build`.
