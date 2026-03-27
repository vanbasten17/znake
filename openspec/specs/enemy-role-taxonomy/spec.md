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

Each role contract SHALL define a readable telegraph and at least one practical counterplay window that can be surfaced by presentation without scene-owned rules.

#### Scenario: Role exposes readable pre-impact signal

- **WHEN** an enemy role enters a high-risk action phase
- **THEN** role state exposes a deterministic telegraph payload before impact resolution
- **AND** telegraph data is available to scene presentation for readable warning cues

#### Scenario: Role exposes counterplay window

- **WHEN** an enemy role commits to its primary pressure action
- **THEN** contract metadata includes a deterministic counterplay window or recovery state
- **AND** the counterplay window is long enough to preserve player agency under fairness thresholds

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

