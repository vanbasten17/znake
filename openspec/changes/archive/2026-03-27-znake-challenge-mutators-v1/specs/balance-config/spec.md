## ADDED Requirements

### Requirement: Central mutator taxonomy and tuning tables

The system SHALL define challenge mutator taxonomy, tuning values, and compatibility metadata in centralized balance configuration.

#### Scenario: Mutator catalog is centrally authored
- **WHEN** runtime loads mutator definitions
- **THEN** it reads mutator taxonomy, effect parameters, and readability metadata from centralized balance config
- **AND** scene or gameplay modules do not hardcode mutator tables inline

#### Scenario: Eligibility and weighting are config-driven
- **WHEN** mutator drafting resolves candidates
- **THEN** eligibility gates and draft weights come from centralized balance config
- **AND** tuning can be adjusted without cross-module constant edits

### Requirement: Central mutator guardrail configuration

The system SHALL define anti-frustration and fairness guardrails for mutator composition in centralized balance configuration.

#### Scenario: Conflict and stack-limit tables are config-driven
- **WHEN** mutator compatibility is evaluated
- **THEN** blocked pairs, domain stack limits, and pressure ceilings are read from centralized balance config
- **AND** compatibility logic does not rely on duplicated inline checks

#### Scenario: Recoverability floors are config-driven
- **WHEN** mutator sets are validated against objective, body-economy, and event-choice constraints
- **THEN** minimum recoverability thresholds are read from centralized balance config
- **AND** rejected candidates include deterministic reason codes for observability
