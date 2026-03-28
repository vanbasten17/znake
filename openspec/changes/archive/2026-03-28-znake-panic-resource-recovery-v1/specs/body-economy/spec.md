## ADDED Requirements

### Requirement: Low-health recovery windows are limited and deterministic

The system SHALL provide deterministic panic-recovery windows at low health with bounded cooldown.

#### Scenario: Low-health state arms panic recovery window
- **WHEN** body economy tick evaluates low-health state near spend floor
- **THEN** a short panic-recovery active window is armed deterministically
- **AND** panic arming applies bounded cooldown before rearming.

#### Scenario: Panic recovery enables one emergency body pulse below floor
- **WHEN** body pulse spend would be blocked by spend floor while panic window is active
- **THEN** one emergency body pulse is applied with zero extra spend
- **AND** panic active window is consumed immediately.
