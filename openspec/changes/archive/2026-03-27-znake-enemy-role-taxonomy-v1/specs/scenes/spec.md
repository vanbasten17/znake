## ADDED Requirements

### Requirement: Role readability orchestration boundary

`GameScene` SHALL orchestrate enemy-role readability cues from simulation state without taking ownership of role behavior rules.

#### Scenario: Scene surfaces role telegraph state

- **WHEN** simulation exposes active role telegraph or counterplay payloads
- **THEN** `GameScene` presents readable warning cues using existing presentation systems
- **AND** scene code does not resolve role intent or mutate role fairness policy inline

#### Scenario: Scene preserves deterministic ownership boundary

- **WHEN** role-related feedback is rendered
- **THEN** role action timing, cadence eligibility, and fairness decisions remain owned by deterministic simulation/config modules
- **AND** scene orchestration remains limited to visual/audio/HUD feedback timing

### Requirement: Room-start role context readability

The scene layer SHALL make room-level role pressure understandable at encounter start.

#### Scenario: Encounter role context is surfaced

- **WHEN** a room encounter begins with multiple enemy roles
- **THEN** scene presentation can surface concise role-pressure context from simulation payloads
- **AND** the player can classify immediate tactical priorities without pausing simulation flow
