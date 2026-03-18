## MODIFIED Requirements

### Requirement: HUD display

The system SHALL keep HUD controls readable and reachable on mobile screen-edge devices.

#### Scenario: Bottom UI avoids home indicator overlap

- **WHEN** app runs on mobile devices with bottom safe-area inset
- **THEN** controls and hint bar apply additional bottom padding from safe-area env values
