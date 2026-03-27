## ADDED Requirements

### Requirement: Elite and miniboss pattern-kit readability contracts
The system SHALL model elite/miniboss kits as deterministic action patterns with explicit telegraph, commitment, and recovery windows exposed for readable counterplay.

#### Scenario: Pattern phases expose readable counterplay windows
- **WHEN** an elite or miniboss starts a pattern action
- **THEN** gameplay resolves ordered phases (`telegraph`, `commit`, `recovery`) deterministically from run state and seed context
- **AND** current phase and remaining phase timing are available to presentation systems for warning cues

#### Scenario: Counterplay window exists before high-commit impact
- **WHEN** a high-commit elite/miniboss action can damage the player
- **THEN** a minimum reaction window is present before impact
- **AND** the action cannot skip directly from neutral state to damaging state in the same resolution step

### Requirement: Elite and miniboss anti-cheap-hit fairness
The system SHALL enforce anti-cheap-hit rules for elite/miniboss pressure sequencing and spawn safety.

#### Scenario: Spawn and activation avoid immediate unavoidable damage
- **WHEN** an elite/miniboss encounter initializes or escalates phase pressure
- **THEN** spawn/activation resolution respects configured safety distance and escape-space checks
- **AND** deterministic fallback rules apply only when strict fairness filters exhaust valid candidates

#### Scenario: Overlapping pressure chains keep player agency
- **WHEN** multiple elite/miniboss pressure sources overlap in the same short interval
- **THEN** anti-overlap guardrails preserve at least one actionable evade or disengage option when alternatives exist
- **AND** unavoidable near-instant repeated-hit chains are blocked by deterministic sequencing constraints

### Requirement: Elite and miniboss progression cadence integration
The system SHALL integrate elite/miniboss encounters into objective/reward progression with deterministic cadence rules.

#### Scenario: Encounter cadence follows progression policy
- **WHEN** run progression resolves upcoming room pressure milestones
- **THEN** elite/miniboss encounter insertion follows centralized cadence policy and run-depth gating
- **AND** cadence resolution remains deterministic for equivalent seed and progression context

#### Scenario: Encounter completion respects objective and reward gating
- **WHEN** an elite/miniboss encounter marked as objective-critical is completed
- **THEN** progression enters the configured reward/objective gate before advancing route flow
- **AND** non-marked encounters resume normal progression without duplicating reward gates
