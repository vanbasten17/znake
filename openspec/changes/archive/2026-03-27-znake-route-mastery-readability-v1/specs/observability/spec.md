## ADDED Requirements

### Requirement: Route-mastery decision telemetry

The system SHALL emit stable telemetry for committed route decisions with mastery context.

#### Scenario: Route decision event includes mastery capture context

- **WHEN** a route choice is committed
- **THEN** telemetry includes chosen room type, local preview context, and updated route-mastery counters
- **AND** payload shape remains stable for cross-run comparison

### Requirement: Run-end route-mastery summary telemetry

The system SHALL include bounded route-mastery summary fields in `run_end` payload.

#### Scenario: Run end reports route-mastery summary

- **WHEN** run summary telemetry is emitted
- **THEN** payload includes route-mastery totals and trend context fields
- **AND** fields align with route decision telemetry taxonomy
