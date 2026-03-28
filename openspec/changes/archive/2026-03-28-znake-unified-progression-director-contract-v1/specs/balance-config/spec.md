## ADDED Requirements

### Requirement: Central unified progression-director tuning inputs
The system SHALL keep unified progression-director input knobs in centralized balance configuration and deterministic helper mappings.

#### Scenario: Unified director inputs remain centrally tuned
- **WHEN** tuning updates depth-band mapping, pacing guardrails, role-window overlays, or terrain knobs
- **THEN** unified progression resolver reads updated values from centralized config/helpers
- **AND** scene orchestration does not require duplicate constant edits
