## Why

Boss floors currently exist but remain a thin variant. A dedicated v1 spec package is needed to evolve boss encounters incrementally without destabilizing the baseline run loop.

## What Changes

- Define boss-floor v1 behavioral targets (phase readability, encounter objective, and transition guarantees).
- Increase boss-floor survivability support by prioritizing shield-powerup availability.
- Prepare implementation tasks for a minimal scaffold that can be iterated in follow-up applies.
- Keep this change unarchived and smoke-test-driven before any rollout.

## Impact

- Affected specs:
  - `gameplay`
- Expected runtime area:
  - `GameScene` boss branch and encounter feedback
