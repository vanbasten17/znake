## ADDED Requirements

### Requirement: Scene-level challenge preset start orchestration

Scenes SHALL orchestrate challenge preset run starts without moving seed/mutator ownership out of shared gameplay systems.

#### Scenario: Menu supports explicit preset start entry points
- **WHEN** player starts from menu using daily/weekly challenge input paths
- **THEN** start flow resolves the requested preset context before scene transition
- **AND** existing standard start path remains available

#### Scenario: Death restart preserves active challenge preset
- **WHEN** player restarts from death while a challenge preset is active
- **THEN** restart resolves run seed using the same preset mode
- **AND** retry transitions preserve deterministic comparability for that preset window
