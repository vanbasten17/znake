# Release KPI Baseline

Minimum KPI evidence required for release candidate review.

## Required Metadata Tuple

All KPI snapshots must include:

- `release_version`
- `release_channel`
- `build_id`

## Minimum Metrics

1. `run_start` count (candidate activity volume)
2. `run_end` count (completed run coverage)
3. `runtime_error` count (stability signal)
4. Top run-end failure reasons (for example from `death_reason` buckets)
5. Per-floor/per-level failure concentration when source telemetry is available

## Evidence Contract

- Snapshot window:
- Data source (events buffer/export/tool):
- Missing fields (if any):
- Reviewer:
- Review date:

## Notes

- Missing metrics must be explicitly marked as unavailable.
- Do not silently infer unavailable values.
- Candidate approval should be blocked when core metrics are missing without documented exception.
