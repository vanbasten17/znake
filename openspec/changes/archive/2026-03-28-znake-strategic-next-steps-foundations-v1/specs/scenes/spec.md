## ADDED Requirements

### Requirement: Menu challenge sharing supports integrity-checked import/export

The system SHALL provide menu actions to export and import deterministic challenge codes with integrity checks.

#### Scenario: Imported challenge code starts deterministic run
- **WHEN** player imports a valid challenge code
- **THEN** menu starts a run with the encoded seed and preset context
- **AND** malformed or checksum-invalid codes are rejected without crash

### Requirement: Menu history surfaces ghost target and adaptive onboarding recommendation

The system SHALL surface ghost-target summary and opt-in adaptive onboarding recommendations using local deterministic history artifacts.

#### Scenario: Repeated early failures trigger optional onboarding rail
- **WHEN** recent run history shows repeated early-floor failures
- **THEN** menu presents a non-blocking onboarding recommendation with apply/dismiss actions
- **AND** recommendation state persists to avoid repeated prompts after user action
