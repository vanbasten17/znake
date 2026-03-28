## ADDED Requirements

### Requirement: Runtime content-pack contract resolves deterministically

The system SHALL resolve a content-pack definition at run start with deterministic fallback behavior.

#### Scenario: Unknown content-pack id falls back safely
- **WHEN** run start context requests an unknown content-pack id
- **THEN** runtime resolves the base content-pack contract
- **AND** run initialization remains deterministic and non-blocking

### Requirement: Latest replay snapshot persists as bounded run artifact

The system SHALL persist the latest replay snapshot using bounded metadata and input events.

#### Scenario: Run end writes replay snapshot for ghost/debug surfaces
- **WHEN** a run ends with available replay capture
- **THEN** runtime stores replay snapshot with seed, preset, floor, score, death reason, and bounded input events
- **AND** snapshot persistence does not alter gameplay resolution
