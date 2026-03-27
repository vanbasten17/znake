## ADDED Requirements

### Requirement: Biome-rule activation lifecycle telemetry
The system SHALL emit stable telemetry for biome gameplay-rule activation and deactivation context.

#### Scenario: Activation emits biome rule context
- **WHEN** biome gameplay rules are activated at a deterministic progression boundary
- **THEN** telemetry includes run identifier, biome identifier, active biome-rule identifiers, and boundary context
- **AND** payload shape remains stable for cross-run balancing analysis

#### Scenario: Deactivation or transition emits lifecycle context
- **WHEN** active biome-rule set changes because of biome transition or deterministic fallback intervention
- **THEN** telemetry includes previous and next rule-set identifiers with transition reason
- **AND** emitted fields support attribution of pressure-rhythm shifts during run progression

### Requirement: Biome guardrail intervention telemetry
The system SHALL emit deterministic telemetry for biome compatibility rejections and fallback interventions.

#### Scenario: Compatibility rejection includes bounded reason code
- **WHEN** a biome rule candidate is rejected by compatibility validation
- **THEN** telemetry includes centralized guardrail reason code and blocked candidate identifier
- **AND** payload distinguishes objective conflict, mutator conflict, and body-economy recoverability conflict categories

#### Scenario: Fallback intervention includes applied action context
- **WHEN** deterministic fallback action is applied after compatibility validation
- **THEN** telemetry includes action type (downgrade, replace, defer) and resulting active rule identifiers
- **AND** payload enables analysis of guardrail frequency by biome and run depth

### Requirement: Run-end biome impact summary telemetry
The system SHALL include bounded biome-impact summary fields in run-end telemetry for balancing and fairness diagnostics.

#### Scenario: Run end reports biome impact context
- **WHEN** a run ends after one or more biome-rule activations
- **THEN** run-end telemetry includes active-biome coverage summary and bounded impact metrics tied to rule domains
- **AND** summary fields align with activation and guardrail telemetry taxonomies used during the run
