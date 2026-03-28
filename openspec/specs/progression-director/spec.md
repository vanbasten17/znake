# progression-director Specification

## Purpose
TBD - created by archiving change znake-unified-progression-director-contract-v1. Update Purpose after archive.
## Requirements
### Requirement: Unified progression-director resolver contract
The system SHALL expose a deterministic progression-director resolver that composes biome phase, floor depth band, pressure budget knobs, encounter role policy caps, and terrain modifier knobs into one payload.

#### Scenario: Equivalent inputs resolve equivalent progression payload
- **WHEN** resolver receives equivalent floor and spawn-index inputs with unchanged centralized tuning
- **THEN** returned progression payload fields are identical across invocations
- **AND** no scene-frame timing variance alters resolver output

#### Scenario: Resolver payload includes bounded composition fields
- **WHEN** progression payload is requested
- **THEN** payload includes biome phase, depth band id, pressure guardrail knobs, role policy window/caps, and terrain modifiers
- **AND** each field is sourced from centralized deterministic helpers/config only

