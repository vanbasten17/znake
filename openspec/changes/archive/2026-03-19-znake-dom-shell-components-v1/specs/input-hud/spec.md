## ADDED Requirements

### Requirement: Runtime shell ID compatibility for input and HUD

The system SHALL keep input and HUD bindings compatible with runtime-mounted shell markup.

#### Scenario: Input controls bind after runtime mount

- **WHEN** input setup runs
- **THEN** directional and action controls can be resolved by their existing button IDs
- **AND** touch/click behavior remains unchanged

#### Scenario: HUD updates remain resilient to import timing

- **WHEN** HUD helpers are imported before shell markup exists
- **THEN** the module does not throw at import time
- **AND** HUD methods resolve required nodes when invoked after shell mount
