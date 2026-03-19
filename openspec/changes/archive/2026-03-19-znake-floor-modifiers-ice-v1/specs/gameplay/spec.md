## MODIFIED Requirements

### Requirement: Floor progression

The system SHALL support temporary hazard-pressure modulation through item interaction.

#### Scenario: Rift battery suppresses hazard window

- **WHEN** player collects a rift battery item
- **THEN** rift pressure is reduced or paused for configured duration

#### Scenario: Non-boss floors use timed portal objective

- **WHEN** a non-boss floor starts
- **THEN** a countdown runs for the active floor objective
- **AND** the active objective type is selected from a deterministic non-boss rotation pattern

#### Scenario: Rotation start varies per run

- **WHEN** a new run starts or restarts
- **THEN** the non-boss objective cycle start is randomized for that run
- **AND** objective order remains stable until the run ends

#### Scenario: Rotation objective can require score threshold

- **WHEN** the active non-boss objective type is `score`
- **THEN** floor completion requires reaching configured score target before timeout pressure defeats the player

#### Scenario: Rotation objective can require kill threshold

- **WHEN** the active non-boss objective type is `kills`
- **THEN** floor completion requires defeating a configured number of enemies
- **AND** enemy availability remains sufficient to make the objective completable

#### Scenario: Squeeze pressure activates after portal grace

- **WHEN** objective countdown and grace window expire without floor completion
- **THEN** map boundaries progressively shrink inward at configured intervals
- **AND** crossing squeeze boundaries is treated as lethal wall collision

#### Scenario: Boss floors keep defeat-to-advance objective

- **WHEN** current floor is a boss floor
- **THEN** progression remains tied to boss elimination
- **AND** timed portal objective is not required for that floor

#### Scenario: Ice modifier applies deterministic extra slide

- **WHEN** floor modifier `ice` is active and snake lands on an ice cell
- **THEN** snake performs configured additional forward step(s) in current direction
- **AND** extra movement obeys existing collision and death rules
- **AND** modifier state is represented in run status text
