## ADDED Requirements

### Requirement: Upgrade families define run identity
The system SHALL define three upgrade families named `aggro`, `control`, and `survival`, each with a distinct gameplay purpose that changes how the player uses movement or space.

#### Scenario: Family taxonomy is available to reward flow
- **WHEN** the upgrade catalog is loaded
- **THEN** each upgrade belongs to exactly one family
- **AND** each family exposes a short identity summary for reward presentation

#### Scenario: Family upgrades change play patterns
- **WHEN** a player reads the initial upgrade pool
- **THEN** each family includes upgrades that affect routing, timing, zoning, or body management
- **AND** the catalog does not rely only on generic additive stat bumps

### Requirement: Upgrade definitions include tradeoff and synergy notes
The system SHALL store short tradeoff and synergy notes for each upgrade so reward surfaces can communicate why a pick matters.

#### Scenario: Upgrade metadata includes decision support
- **WHEN** reward selection consumes an upgrade definition
- **THEN** it can access the upgrade's gameplay purpose, tradeoff note, and synergy note without inspecting rendering code

### Requirement: Reward flow consumes family-aware upgrade choices
The system SHALL expose a deterministic selection contract that reward flow can use to draft identity-forward upgrade options.

#### Scenario: Draft helper returns reward-ready choices
- **WHEN** reward flow requests upgrade choices for a run seed and floor
- **THEN** it receives a deterministic list of upgrade definitions
- **AND** the helper avoids duplicate upgrade ids in the same draft

#### Scenario: Early draft contrast is preserved
- **WHEN** the first-pass upgrade helper builds a draft from the initial pool
- **THEN** the returned set favors visible family contrast or role contrast
- **AND** repeated family stacking remains possible only after contrast rules are satisfied
