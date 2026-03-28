# upgrade-identity Specification

## Purpose
TBD - created by archiving change znake-upgrade-identity-v1. Update Purpose after archive.
## Requirements
### Requirement: Upgrade families define run identity

The system SHALL define three upgrade families named `aggro`, `control`, and `survival`, each with a distinct gameplay purpose and explicit family-level tradeoff guidance that changes how the player uses movement or space.

#### Scenario: Family taxonomy is available to reward flow

- **WHEN** the upgrade catalog is loaded
- **THEN** each upgrade belongs to exactly one family
- **AND** each family exposes a short identity summary for reward presentation

#### Scenario: Family upgrades change play patterns

- **WHEN** a player reads the initial upgrade pool
- **THEN** each family includes upgrades that affect routing, timing, zoning, or body management
- **AND** the catalog does not rely only on generic additive stat bumps

#### Scenario: Family metadata includes both affordance and tradeoff framing

- **WHEN** family presentation metadata is consumed by selection surfaces
- **THEN** it includes concise guidance for what the family enables
- **AND** it includes concise guidance for what the family tends to sacrifice or risk

### Requirement: Upgrade definitions include tradeoff and synergy notes

The system SHALL store short tradeoff and synergy notes for each upgrade so reward surfaces can communicate why a pick matters.

#### Scenario: Upgrade metadata includes decision support

- **WHEN** reward selection consumes an upgrade definition
- **THEN** it can access the upgrade's gameplay purpose, tradeoff note, and synergy note without inspecting rendering code

#### Scenario: Upgrade consequences remain readable at pick time

- **WHEN** an upgrade card is shown
- **THEN** gameplay and tradeoff notes are presented as distinct consequence cues
- **AND** the player can compare downside risk without inspecting external menus

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

### Requirement: Upgrade identity cues include explicit comparison chips

The system SHALL include explicit comparison chips for synergy and conflict in upgrade decision surfaces.

#### Scenario: Identity and consequence cues stay separable
- **WHEN** upgrade card is displayed in decision surfaces
- **THEN** synergy and conflict chips remain visually distinct from family identity and consequence body text
- **AND** players can compare options quickly without opening external menus

