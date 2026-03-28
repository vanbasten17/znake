# enemy-role-taxonomy Specification

## Purpose
TBD - created by archiving change znake-enemy-role-taxonomy-v1. Update Purpose after archive.
## Requirements
### Requirement: Enemy role contract registry

The system SHALL define a first-pass role taxonomy registry containing `sniper`, `blocker`, `summoner`, `charger`, and `leech` as explicit gameplay role contracts.

#### Scenario: All first-pass roles are registered

- **WHEN** gameplay loads enemy role taxonomy configuration for a run
- **THEN** the registry includes exactly the five first-pass roles `sniper`, `blocker`, `summoner`, `charger`, and `leech`
- **AND** each role includes machine-readable contract metadata for role intent, telegraph class, and counterplay class

### Requirement: Role telegraph and counterplay readability

Each role contract SHALL define a readable telegraph and at least one practical counterplay window that can be surfaced by presentation without scene-owned rules, and tuned telegraph minima SHALL preserve reaction opportunities under typical room pressure.

#### Scenario: Role exposes readable pre-impact signal

- **WHEN** an enemy role enters a high-risk action phase
- **THEN** role state exposes a deterministic telegraph payload before impact resolution
- **AND** telegraph data is available to scene presentation for readable warning cues

#### Scenario: Role exposes counterplay window

- **WHEN** an enemy role commits to its primary pressure action
- **THEN** contract metadata includes a deterministic counterplay window or recovery state
- **AND** the counterplay window is long enough to preserve player agency under fairness thresholds

#### Scenario: Tuned role telegraph minima remain challenge-preserving

- **WHEN** role telegraph minima are increased for fairness
- **THEN** role actions remain threatening and cadence-relevant
- **AND** tuning does not collapse role identity into passive behavior

### Requirement: Role-level fairness guardrails

The system SHALL enforce role-level fairness guardrails so role pressure remains dangerous but not unavoidable.

#### Scenario: Role pressure avoids unavoidable burst stacking

- **WHEN** role composition and cadence are evaluated for active room pressure
- **THEN** configured anti-stack guardrails prevent unfair overlap of high-burst role actions when valid alternatives exist
- **AND** fallback behavior remains deterministic if constraints cannot be fully satisfied

#### Scenario: Role contracts preserve reaction windows

- **WHEN** role telegraph and action timings are resolved
- **THEN** configured minimum reaction windows are respected for first-pass roles
- **AND** no role bypasses fairness timing contracts through scene-only overrides

### Requirement: Deterministic role resolution

Role intent, telegraph, and cadence outcomes SHALL remain deterministic from seeded simulation state and config inputs.

#### Scenario: Same seed yields same role outcomes

- **WHEN** two simulations run with the same seed, role config, and input stream
- **THEN** role composition, telegraph timing, and action resolution match deterministically
- **AND** scene rendering order does not affect role behavior outcomes

### Requirement: Depth-aware role composition cadence
The system SHALL resolve enemy role composition cadence by depth band so encounter variety increases with progression while preserving role readability.

#### Scenario: Role cadence policy varies by depth band
- **WHEN** enemy role composition is resolved for spawn cadence within floors 1-15
- **THEN** role weights/caps/gaps are selected from depth-band role policy
- **AND** deeper bands can increase composition variety without violating role contract limits

#### Scenario: Role readability contracts remain preserved under depth tuning
- **WHEN** depth-band role policy increases pressure or role overlap potential
- **THEN** telegraph and counterplay readability minima remain enforced for active roles
- **AND** tuning does not obscure role identity or collapse readable counterplay windows

### Requirement: Deterministic depth-band role outcomes
Role cadence outcomes SHALL remain deterministic for identical seed, depth-band config, and simulation inputs.

#### Scenario: Same seed yields same depth-band composition outcomes
- **WHEN** two runs share the same seed, depth-band role policy, and input stream
- **THEN** role composition cadence outcomes match across floors
- **AND** scene render/update ordering does not alter role cadence resolution

### Requirement: Enemy pathfinding uses strategy service interfaces
Enemy chase-path preference resolution SHALL be routed through a dedicated strategy service interface.

#### Scenario: Default strategy preserves deterministic chase preference ordering
- **WHEN** enemy pathfinding resolves preferred directions through default service
- **THEN** returned directions remain cardinal and deterministically prioritized from simulation inputs
- **AND** behavior remains equivalent to prior enemy chase intent.

#### Scenario: Strategy interface allows deterministic override in tests
- **WHEN** a custom pathfinding strategy service is provided
- **THEN** preferred-direction resolution uses that service output
- **AND** simulation callers preserve deterministic ordering semantics.

### Requirement: Dangerous enemy actions are telegraphed before execution
High-risk enemy actions SHALL expose deterministic telegraph state before commit.

#### Scenario: Ambusher dash telegraph appears before movement commit
- **WHEN** ambusher dash intent is triggered
- **THEN** enemy enters `ambusher_dash` telegraph state with remaining ticks
- **AND** readability state reports active telegraph window before dash execution.

#### Scenario: Egg hatch countdown remains telegraphed while pending
- **WHEN** egg hatch countdown is still above zero
- **THEN** enemy readability telegraph state stays active with bounded remaining counterplay ticks
- **AND** hatch conversion is deferred until countdown reaches zero.
