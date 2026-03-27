## ADDED Requirements

### Requirement: Central biome-rule taxonomy and tuning tables
The system SHALL define biome gameplay-rule taxonomy, effect domains, and first-pass tuning values in centralized balance configuration.

#### Scenario: Biome rule catalog is centrally authored
- **WHEN** runtime resolves biome gameplay-rule definitions
- **THEN** biome rule identifiers, effect-domain tags, and baseline tuning values are read from centralized balance config
- **AND** gameplay/scene code does not hardcode duplicate biome-rule catalogs inline

#### Scenario: Biome activation policy knobs are centrally tuned
- **WHEN** gameplay resolves per-boundary biome activation policy
- **THEN** activation priorities, concurrent-rule limits, and deterministic fallback preferences come from centralized balance config
- **AND** tuning changes do not require scene-local logic edits

### Requirement: Central biome compatibility and guardrail policy
The system SHALL keep biome compatibility matrices and recoverability guardrails in centralized balance configuration.

#### Scenario: Cross-system compatibility constraints are config-driven
- **WHEN** biome candidates are validated against objective kind, mutator domains, and body-economy context
- **THEN** compatibility allow/deny matrices and pressure-budget ceilings are read from centralized balance config
- **AND** validation logic uses shared policy without duplicated inline checks

#### Scenario: Guardrail fallback policy is config-driven
- **WHEN** strict compatibility filters reject a biome rule candidate
- **THEN** deterministic fallback action priority (downgrade, replace, or defer) comes from centralized balance config
- **AND** fallback thresholds remain tunable without multi-module constant edits

### Requirement: Central readability and telemetry descriptor mapping for biome rules
The system SHALL define player-facing readability descriptors and telemetry-facing reason mappings for biome rule states in centralized balance configuration.

#### Scenario: Active-rule readability descriptors are centrally defined
- **WHEN** HUD or overlay resolves active biome rule summaries
- **THEN** concise rule labels, effect summaries, and tactical tags are read from centralized balance config
- **AND** scene code consumes descriptors without authoring gameplay semantics inline

#### Scenario: Guardrail reason mappings are centrally defined
- **WHEN** compatibility rejection or fallback intervention is emitted for biome rules
- **THEN** bounded reason codes and descriptor mappings come from centralized balance config
- **AND** observability payloads align with shared reason taxonomy
