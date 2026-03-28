## ADDED Requirements

### Requirement: Depth-band enemy composition window config

The system SHALL define deterministic role-composition windows per depth band as a data-driven overlay on base role policies.

#### Scenario: Depth-band windows provide bounded role-weight modulation
- **WHEN** a depth band is configured
- **THEN** composition config includes bounded windows with role-weight multipliers and optional cap overrides
- **AND** windows retain deterministic ordering and bounded window-size semantics
