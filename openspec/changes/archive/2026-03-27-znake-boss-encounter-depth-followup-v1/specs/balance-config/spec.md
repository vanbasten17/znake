## ADDED Requirements

### Requirement: Central boss identity and readability descriptor mapping
The system SHALL define boss identity labels, cue descriptors, and phase readability metadata in centralized balance configuration.

#### Scenario: Boss cue descriptors are balance-driven
- **WHEN** gameplay resolves boss identity label or phase readability descriptor
- **THEN** values are read from centralized balance configuration
- **AND** scene and gameplay modules do not duplicate boss descriptor constants inline

### Requirement: Central boss counterplay fairness tuning
The system SHALL define boss-specific counterplay reaction floors and overlap guardrail thresholds in centralized balance configuration.

#### Scenario: Boss reaction and overlap thresholds are config-driven
- **WHEN** boss encounter fairness validation runs during phase escalation or pressure overlap checks
- **THEN** minimum reaction windows and overlap thresholds are resolved from centralized balance config
- **AND** tuning can be adjusted without editing scene-local logic
