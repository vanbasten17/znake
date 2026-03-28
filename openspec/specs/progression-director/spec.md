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

### Requirement: Adaptive room pressure follows run-state bands
Room pressure setup SHALL adapt enemy pressure from progression snapshot plus bounded run-state bands.

#### Scenario: Recovery band eases pressure when shields are depleted
- **WHEN** room setup resolves with no active shields
- **THEN** adaptive director resolves `recovery` band and eases pressure with safer enemy cadence/count bounds
- **AND** resulting values remain deterministic for equivalent inputs.

#### Scenario: Pressure band tightens cadence for stabilized runs
- **WHEN** room setup resolves with high shield stability
- **THEN** adaptive director resolves `pressure` band and can tighten cadence/increase count within depth-band bounds
- **AND** tuning remains bounded by deterministic floor/depth config.
