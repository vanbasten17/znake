## ADDED Requirements

### Requirement: Body economy run configuration contracts
The system SHALL expose deterministic run configuration fields for body economy sinks and guards.

#### Scenario: Run config includes sink tuning fields
- **WHEN** run configuration is initialized
- **THEN** it includes body pulse and reward overclock tuning fields (cost, cooldown/limit, duration where applicable)
- **AND** fields are available to simulation helpers without scene coupling

#### Scenario: Run config includes shared spend floor
- **WHEN** run configuration is initialized
- **THEN** it includes minimum spendable body length floor used by all body spend sinks
- **AND** default values preserve stable gameplay when body economy is not actively used

### Requirement: Deterministic body economy runtime state
The system SHALL maintain deterministic runtime state for body economy cooldown and reward-window usage.

#### Scenario: Seed and equal inputs reproduce body economy state transitions
- **WHEN** two runs share seed and equivalent spend inputs
- **THEN** body economy cooldown and usage transitions occur in equivalent order
- **AND** resulting segment counts and sink availability are equivalent

#### Scenario: Reward overclock usage resets on new objective completion window
- **WHEN** reward selection begins for a new completed objective
- **THEN** reward overclock usage state resets for that window
- **AND** previous window usage does not leak into subsequent reward windows

