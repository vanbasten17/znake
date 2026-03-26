## ADDED Requirements

### Requirement: Combat fairness windows
The system SHALL provide short, tunable reaction windows around high-risk combat moments without pausing the simulation or granting broad invulnerability.

#### Scenario: Room entry grants brief contact grace
- **WHEN** a new floor begins and gameplay control starts
- **THEN** player enemy-contact damage is suppressed for a short configured room-entry grace window
- **AND** enemy movement and other board systems continue normally

#### Scenario: Nonlethal damage grants brief recovery grace
- **WHEN** the player survives enemy or hazard contact that removes shields or body segments
- **THEN** the system starts a short configured post-hit grace window
- **AND** repeated contact during that window does not immediately remove additional shields or segments

### Requirement: Enemy telegraph readability
The system SHALL surface imminent dangerous enemy actions before impact using deterministic, tunable telegraph timing.

#### Scenario: Ambusher dash is telegraphed before execution
- **WHEN** an ambusher becomes eligible to perform a dash attack
- **THEN** it enters a telegraph state for a configured number of enemy movement ticks before the dash resolves
- **AND** that telegraph state is available to presentation code for clear warning cues

#### Scenario: Egg hatch warns before threat state changes
- **WHEN** an egg enemy is close to hatching
- **THEN** its remaining hatch time is available for readable pre-hatch presentation cues
- **AND** the hatch still resolves deterministically from simulation state

### Requirement: Enemy spawn fairness
The system SHALL validate enemy spawn locations against localized fairness rules before committing a spawn.

#### Scenario: Enemy spawn avoids immediate player pressure
- **WHEN** a new enemy spawn cell is selected
- **THEN** the chosen cell respects configured minimum distance and lane-pressure fairness rules relative to the player head
- **AND** the spawn does not begin in an obviously near-instant-hit position

#### Scenario: Enemy spawn avoids low-agency pockets when possible
- **WHEN** enemy spawn candidates are evaluated
- **THEN** candidates with insufficient local escape space are rejected while fair alternatives exist
- **AND** the system falls back deterministically to general open-cell selection only if stricter fairness filters exhaust valid candidates
