# route-mastery-readability Specification

## Purpose
TBD - created by archiving change znake-route-mastery-readability-v1. Update Purpose after archive.
## Requirements
### Requirement: Deterministic route-mastery summary model

The system SHALL maintain a deterministic route-mastery summary state that updates from explicit route decision commits.

#### Scenario: Equivalent route decisions yield equivalent summary

- **WHEN** two runs commit equivalent route decisions in the same order
- **THEN** route-mastery summary counters and trend fields match exactly
- **AND** summary updates are independent from render timing

### Requirement: Route-learning readouts

The system SHALL expose concise route-mastery readouts for in-run and post-run learning.

#### Scenario: In-run readout shows compact mastery trend

- **WHEN** run HUD route status is shown
- **THEN** it includes compact route-mastery trend context
- **AND** readout remains bounded and readable alongside route metadata

#### Scenario: Death recap includes route-mastery context

- **WHEN** death recap is rendered
- **THEN** recap includes concise route-mastery summary context
- **AND** readout helps explain decision quality and potential route-pressure failure factors

