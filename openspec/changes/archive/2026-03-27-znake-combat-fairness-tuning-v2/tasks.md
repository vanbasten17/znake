## 1. Telegraph readability tuning

- [x] 1.1 Increase combat telegraph timing thresholds in centralized balance config for high-risk actions (ambusher/egg and role telegraph knobs).
- [x] 1.2 Tune elite/miniboss minimum reaction/readability thresholds in centralized fairness config to stay aligned with the readability goal.

## 2. Spawn fairness and breathing window tuning

- [x] 2.1 Tighten centralized spawn safety thresholds (distance, forward-lane avoidance, local escape neighbors) while preserving deterministic fallback behavior.
- [x] 2.2 Tune room-entry and post-hit grace windows in centralized combat fairness config.

## 3. Validate

- [x] 3.1 Run `pnpm check` and fix any issues introduced by this change.
