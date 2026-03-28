## ADDED Requirements

### Requirement: Production runtime error capture with release tagging
The system SHALL capture runtime errors in production-targeted builds with release metadata required for triage and rollback decisions.

#### Scenario: Unhandled runtime errors are captured with release context
- **WHEN** an unhandled runtime error occurs during active gameplay or shell runtime
- **THEN** observability records an error event with error name/category and bounded stack/context payload
- **AND** event payload includes `release_version`, `release_channel`, and `build_id`

#### Scenario: Error capture does not mutate gameplay simulation outcomes
- **WHEN** runtime error capture is active
- **THEN** capture behavior is non-blocking and best-effort
- **AND** deterministic simulation resolution order remains unchanged

### Requirement: Minimum release KPI dashboard contract
The system SHALL define a minimum KPI contract that can be computed from existing gameplay telemetry for release-readiness review.

#### Scenario: KPI contract exposes bounded release health metrics
- **WHEN** a release candidate dashboard snapshot is generated
- **THEN** it includes at minimum run starts, run completions, crash/error count, and top run-end failure reasons
- **AND** metrics are attributable by the release metadata tuple

#### Scenario: KPI contract includes level progression failure insight
- **WHEN** release telemetry is summarized for tuning review
- **THEN** dashboard data includes bounded per-level or per-floor fail concentration fields where available from existing telemetry
- **AND** missing-source fields are explicitly marked as unavailable rather than inferred silently

