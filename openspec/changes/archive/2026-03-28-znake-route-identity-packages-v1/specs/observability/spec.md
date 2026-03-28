## ADDED Requirements

### Requirement: Route package application telemetry context

The system SHALL emit stable route package context when route identity effects are applied.

#### Scenario: Route package event includes identity and delta fields
- **WHEN** route package effects are resolved
- **THEN** telemetry includes route package id/tag and applied delta context fields
- **AND** payload supports comparison across depth bands
