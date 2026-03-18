## MODIFIED Requirements

### Requirement: Progression telemetry

The system SHALL emit telemetry for newly added elite and item interactions.

#### Scenario: Elite lifecycle is tracked

- **WHEN** ambusher (or other elite kind) is spawned and defeated
- **THEN** telemetry emits `elite_spawned` and `elite_defeated` with elite kind and floor context

#### Scenario: Rift battery interaction is tracked

- **WHEN** rift battery is collected and suppression starts/ends
- **THEN** telemetry emits `item_collected` and `rift_suppressed` with duration/effect context
