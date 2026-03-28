## ADDED Requirements

### Requirement: Death recap trend insight block

The system SHALL include a bounded trend insight block in death recap using recent run-history reason data.

#### Scenario: Recap shows top recent failure reason with sample context
- **WHEN** death recap is rendered and recent history has sufficient entries
- **THEN** recap shows the top recent failure reason with count/sample context
- **AND** trend uses bounded recent history window only

#### Scenario: Recap falls back for low history sample
- **WHEN** recent history does not have sufficient entries for trend signal
- **THEN** recap shows a fallback insight anchored to current run reason
- **AND** recap remains readable without extra interaction
