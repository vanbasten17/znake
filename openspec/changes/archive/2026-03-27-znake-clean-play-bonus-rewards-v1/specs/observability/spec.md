## ADDED Requirements

### Requirement: Clean-play bonus telemetry

The system SHALL emit stable telemetry describing clean-play eligibility, result, and payout for completed objectives.

#### Scenario: Objective completion emits clean-play result context

- **WHEN** an objective completion is resolved
- **THEN** telemetry includes a clean-play result field indicating whether eligibility was met
- **AND** payload includes objective kind and deterministic qualification context needed for tuning

#### Scenario: Bonus payout emits bounded payout context

- **WHEN** a clean-play bonus payout is applied
- **THEN** telemetry includes payout type, amount, and objective-window identifier
- **AND** the payload supports detecting duplicate or exploit-like payout patterns without requiring scene-specific logs
