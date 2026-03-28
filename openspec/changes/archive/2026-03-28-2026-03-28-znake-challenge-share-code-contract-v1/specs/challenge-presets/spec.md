## ADDED Requirements

### Requirement: Challenge share-code deterministic integrity contract

The system SHALL provide deterministic challenge share-code export/import with bounded normalization and checksum-backed integrity validation.

#### Scenario: Exported share code round-trips into deterministic challenge context

- **WHEN** a challenge share code is exported from a run context and then imported without modification
- **THEN** imported payload preserves seed, challenge preset id, forced mutator id (when present), floor, and score context
- **AND** payload values normalize to bounded non-negative integer fields for floor/score

#### Scenario: Import rejects tampered or malformed payload

- **WHEN** a share code checksum does not match or payload format is invalid
- **THEN** import returns failure with deterministic reason context
- **AND** run start is not triggered from the malformed code

#### Scenario: Import accepts case-insensitive prefix without weakening integrity rules

- **WHEN** user pastes a valid share code whose prefix casing differs from canonical export casing
- **THEN** parser treats prefix equivalently for format matching
- **AND** checksum and payload validation rules remain unchanged
