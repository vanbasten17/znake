## ADDED Requirements

### Requirement: Shared balancing cookbook for deterministic iteration

The system SHALL provide a developer-facing balancing cookbook that maps common gameplay signals to deterministic tuning actions and validation steps.

#### Scenario: Contributor follows cookbook for a tuning pass
- **WHEN** contributor performs a balancing iteration
- **THEN** cookbook provides signal-to-knob mapping, validation checklist, and rollback rules
- **AND** workflow emphasizes bounded deterministic changes over broad ad-hoc tweaks
