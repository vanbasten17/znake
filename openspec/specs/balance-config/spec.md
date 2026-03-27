# balance-config Specification

## Purpose
TBD - created by archiving change znake-data-driven-balance-v1. Update Purpose after archive.
## Requirements
### Requirement: Central balance source

The system SHALL keep gameplay content selection rules in centralized, data-driven configuration rather than scene-local hardcoded lists.

#### Scenario: Spawn pools are data-driven

- **WHEN** gameplay resolves powerup/enemy variant selection policy
- **THEN** selection pools and weights are read from config modules
- **AND** scene code avoids inline hardcoded selection arrays for these systems

### Requirement: Objective and reward tuning tables

The system SHALL keep room objective declarations, objective target values, reward definitions, and clean-play rule/payout tables in centralized balance configuration.

#### Scenario: Objective targets are centrally tuned

- **WHEN** gameplay resolves duration, count, or activation targets for a room objective
- **THEN** those values come from centralized balance data
- **AND** they are not hardcoded inline in scene logic

#### Scenario: Reward tradeoffs are centrally tuned

- **WHEN** gameplay resolves a reward option's positive and negative modifiers
- **THEN** those values come from centralized balance data
- **AND** reward selection UI does not define gameplay effect magnitudes inline

#### Scenario: Clean-play eligibility rules are centrally tuned

- **WHEN** gameplay evaluates whether a completed objective qualifies for clean-play status
- **THEN** condition flags and qualification constraints come from centralized balance config
- **AND** objective and scene code does not hardcode duplicate eligibility constants

#### Scenario: Clean-play payout rules are centrally tuned

- **WHEN** gameplay resolves clean-play bonus payout type, amount, and per-objective caps
- **THEN** those values come from centralized balance config
- **AND** reward/recap presentation paths consume resolved values without redefining magnitudes inline

### Requirement: Central combat fairness tuning

The system SHALL define combat fairness timings and spawn-safety thresholds in centralized balance configuration.

#### Scenario: Telegraph timing is balance-driven

- **WHEN** enemy telegraph duration or warning cadence is evaluated
- **THEN** the values come from centralized balance config
- **AND** enemy or scene code does not hardcode duplicate timing constants

#### Scenario: Grace windows and spawn safety thresholds are balance-driven

- **WHEN** room-entry grace, post-hit grace, minimum spawn distance, lane exclusion, or escape-space thresholds are evaluated
- **THEN** the values come from centralized balance config
- **AND** fairness rules can be tuned without editing multiple gameplay call sites

### Requirement: Central feedback tuning

The system SHALL keep first-pass feedback timing and intensity values in centralized configuration.

#### Scenario: Damage and pickup feedback are config-driven

- **WHEN** flash duration, shake duration, hit-stop window, or related pickup/damage emphasis values are evaluated
- **THEN** the values come from centralized balance config
- **AND** scene code does not duplicate those timing constants inline

#### Scenario: Objective celebration feedback is config-driven

- **WHEN** reward-ready or objective-complete emphasis values are evaluated
- **THEN** the values come from centralized balance config
- **AND** celebration tuning can be iterated without editing multiple call sites

### Requirement: Central run-map tuning tables

The system SHALL keep room-type templates, branch rules, and route-preview tuning in centralized balance configuration.

#### Scenario: Room-type distributions are centrally tuned

- **WHEN** gameplay resolves which room types can appear at a given run depth or branch point
- **THEN** those distributions come from centralized balance data
- **AND** scene code does not hardcode room-type sequencing inline

#### Scenario: Preview horizon and branch cadence are centrally tuned

- **WHEN** gameplay resolves how many future choices to expose or how often branches appear
- **THEN** those values come from centralized balance data
- **AND** route readability can be tuned without editing multiple presentation call sites

### Requirement: Central body economy tuning
The system SHALL define first-pass body economy costs, cooldowns, and gating thresholds in centralized balance configuration.

#### Scenario: Body pulse tuning is config-driven
- **WHEN** gameplay evaluates body pulse segment cost, cooldown, and effect duration
- **THEN** each value comes from centralized balance config
- **AND** scene/gameplay call sites do not duplicate inline constants

#### Scenario: Reward overclock tuning is config-driven
- **WHEN** gameplay evaluates reward overclock segment cost and per-objective usage limit
- **THEN** values come from centralized balance config
- **AND** reward flow code does not hardcode spend magnitudes

#### Scenario: Minimum spendable floor is config-driven
- **WHEN** gameplay validates any body spend request
- **THEN** minimum spendable length floor is read from centralized balance config
- **AND** all body sinks use the same shared floor policy

dits

### Requirement: Central role cadence and composition policy

The system SHALL keep room-level role cadence, caps, and anti-stack constraints in centralized balance configuration.

#### Scenario: Role cadence is centrally tuned

- **WHEN** spawn cadence or role action cadence is evaluated
- **THEN** cadence intervals and weighting policies come from centralized config
- **AND** encounter pacing can be tuned without editing multiple call sites

#### Scenario: Anti-stack constraints are centrally tuned

- **WHEN** gameplay evaluates simultaneous high-pressure role overlap
- **THEN** max-overlap, cooldown-gap, or equivalent anti-stack thresholds come from centralized config
- **AND** deterministic fallback thresholds are defined when strict constraints cannot be satisfied

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

### Requirement: Central elite and miniboss pattern-window tuning
The system SHALL keep elite/miniboss telegraph, commit, and recovery window knobs in centralized balance configuration.

#### Scenario: Pattern windows are balance-driven
- **WHEN** elite/miniboss phase durations or warning lead times are evaluated
- **THEN** values are resolved from centralized balance config
- **AND** gameplay and scene code do not duplicate those timing constants inline

### Requirement: Central anti-cheap-hit fairness thresholds for elite and miniboss encounters
The system SHALL define elite/miniboss reaction, spawn-safety, and anti-overlap thresholds in centralized balance configuration.

#### Scenario: Reaction and spawn safety thresholds are config-driven
- **WHEN** elite/miniboss fairness validation runs
- **THEN** minimum reaction windows, minimum spawn distance, and escape-space floors come from centralized balance config
- **AND** deterministic fallback thresholds are configured for exhausted strict-filter cases

#### Scenario: Anti-overlap sequencing is config-driven
- **WHEN** gameplay validates stacked elite/miniboss pressure intervals
- **THEN** overlap caps and required cadence gaps come from centralized balance config
- **AND** tuning can adjust fairness without editing scene-local logic

### Requirement: Central elite and miniboss cadence and reward-gate policy
The system SHALL define elite/miniboss encounter cadence and objective/reward gate policy in centralized balance configuration.

#### Scenario: Cadence policy is centrally authored
- **WHEN** run progression resolves elite/miniboss encounter frequency by depth or segment window
- **THEN** cadence tables and eligibility weights are read from centralized config
- **AND** progression systems consume resolved policy without hardcoded per-scene cadence lists

#### Scenario: Reward-gate policy is centrally authored
- **WHEN** an elite/miniboss encounter completes
- **THEN** objective-critical reward gating policy is resolved from centralized config
- **AND** reward flow paths do not hardcode encounter-specific gate exceptions inline

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

### Requirement: Central predator-prey pacing tuning tables

The system SHALL define pacing phase durations, transition thresholds, and opening policy in centralized balance configuration.

#### Scenario: Pacing phase knobs are config-driven

- **WHEN** gameplay resolves pacing phase timing or transition thresholds
- **THEN** values are read from centralized balance config
- **AND** simulation/scene code avoids duplicating inline pacing constants

### Requirement: Central anti-overlap pressure guardrail policy

The system SHALL define overlap budgets, cadence gaps, and deterministic fallback priorities for pressure sequencing in centralized balance configuration.

#### Scenario: Overlap thresholds are config-driven

- **WHEN** overlap guardrail validation evaluates simultaneous pressure windows
- **THEN** max-overlap and minimum cadence-gap thresholds come from centralized config
- **AND** tuning can adjust fairness without editing multiple call sites

#### Scenario: Guardrail reason and fallback mappings are centrally defined

- **WHEN** overlap guardrails defer, downgrade, or allow a pressured action
- **THEN** reason-code mappings and fallback priorities are read from centralized config
- **AND** telemetry/readability consumers use shared taxonomy without scene-local remapping

