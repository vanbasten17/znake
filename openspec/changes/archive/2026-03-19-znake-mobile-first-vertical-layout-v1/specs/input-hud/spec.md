## MODIFIED Requirements

### Requirement: HUD display

The system SHALL keep HUD controls readable and reachable on mobile screen-edge devices with a portrait-first run shell.

#### Scenario: Bottom UI avoids home indicator overlap

- **WHEN** app runs on mobile devices with bottom safe-area inset
- **THEN** controls and hint bar apply additional bottom padding from safe-area env values

#### Scenario: Run shell uses 2/3 gameplay and 1/3 controls on touch devices

- **WHEN** control mode is touch and scene chrome is `run`
- **THEN** the run layout allocates roughly two-thirds of available vertical space to gameplay container
- **AND** allocates roughly one-third to control container
- **AND** keeps hint bar readable below controls

#### Scenario: Keyboard mode keeps gameplay priority

- **WHEN** control mode is keyboard
- **THEN** touch controls are hidden
- **AND** gameplay area expands instead of reserving control space
