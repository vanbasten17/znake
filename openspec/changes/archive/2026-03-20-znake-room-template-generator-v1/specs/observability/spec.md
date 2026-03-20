## MODIFIED Requirements

### Requirement: Progression telemetry

The system SHALL emit telemetry for newly added elite, item, and floor-template interactions.

#### Scenario: Elite lifecycle is tracked

- **WHEN** ambusher (or other elite kind) is spawned and defeated
- **THEN** telemetry emits `elite_spawned` and `elite_defeated` with elite kind and floor context

#### Scenario: Rift battery interaction is tracked

- **WHEN** rift battery is collected and suppression starts/ends
- **THEN** telemetry emits `item_collected` and `rift_suppressed` with duration/effect context

#### Scenario: Floor template selection is tracked

- **WHEN** a floor starts and template is resolved
- **THEN** telemetry emits `floor_template_selected`
- **AND** payload includes floor, selected template, and fallback usage
