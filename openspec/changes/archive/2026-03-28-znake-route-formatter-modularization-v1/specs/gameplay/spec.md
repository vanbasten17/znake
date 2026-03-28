## ADDED Requirements

### Requirement: Route risk formatting is utility-driven and consistent

Gameplay route overlays SHALL use a reusable formatter utility for risk cue composition.

#### Scenario: Formatter produces stable risk cue text
- **WHEN** route risk level and localized label are provided
- **THEN** formatter returns a stable cue string that scenes can render directly.
