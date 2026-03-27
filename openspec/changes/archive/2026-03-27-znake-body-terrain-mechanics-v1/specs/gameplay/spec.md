## ADDED Requirements

### Requirement: Body positioning as tactical terrain

The system SHALL treat snake body positioning as deterministic tactical terrain influencing lane control, local safety pockets, and trap-risk readability.

#### Scenario: Tactical terrain snapshot updates during movement

- **WHEN** player movement changes body layout
- **THEN** tactical terrain snapshot updates deterministically from gameplay state
- **AND** resulting fields can be consumed by fairness/readability systems without scene-owned logic

### Requirement: Body-terrain fairness guardrails

The system SHALL preserve recoverability by preventing body-economy actions that would push the player into no-agency trap states under active pressure.

#### Scenario: Low-agency spend is prevented when pressure is active

- **WHEN** pressure is active and body terrain falls below configured safe-pocket threshold
- **THEN** guarded spend actions are blocked deterministically
- **AND** player receives concise readable feedback on the blocked action
