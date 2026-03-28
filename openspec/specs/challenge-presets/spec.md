# challenge-presets Specification

## Purpose
TBD - created by archiving change znake-daily-weekly-challenge-presets-v1. Update Purpose after archive.
## Requirements
### Requirement: Calendar-bucketed challenge preset contract

The system SHALL define challenge preset contracts for `standard`, `daily`, and `weekly` run starts.

#### Scenario: Preset ids resolve to stable bucket semantics
- **WHEN** a run-start request includes challenge preset id
- **THEN** `standard` uses fallback ad-hoc seed behavior
- **AND** `daily` resolves through UTC day bucket semantics
- **AND** `weekly` resolves through UTC week bucket semantics

### Requirement: Preset includes bounded modifier-pack context

The system SHALL include bounded modifier-pack context in challenge preset resolution output.

#### Scenario: Preset resolution can emit deterministic mutator identifier
- **WHEN** a `daily` or `weekly` preset is resolved
- **THEN** output may include one deterministic mutator identifier from configured pool
- **AND** `standard` preset returns no forced mutator identifier

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

### Requirement: URL-safe challenge-share body compatibility

The system SHALL accept URL-safe challenge-share body variants by canonical normalization before integrity validation.

#### Scenario: URL-safe body variant resolves equivalently

- **WHEN** a valid challenge-share code body is represented with URL-safe base64 substitutions (`-` for `+`, `_` for `/`)
- **THEN** parser canonicalizes body before checksum and decode
- **AND** resulting parsed payload is equivalent to canonical-body import

#### Scenario: Integrity checks remain strict after canonicalization

- **WHEN** canonicalized body checksum mismatches or payload is invalid
- **THEN** parser returns deterministic failure reason
- **AND** malformed share code does not trigger run start


### Requirement: Heat tier mutator ladder contract

The system SHALL support deterministic heat-tier mutator stacking derived from preset mutator context.

#### Scenario: Heat-tier stack derivation is deterministic
- **WHEN** forced mutator context and heat-tier input are provided
- **THEN** mutator stack order resolves deterministically from canonical pool rotation
- **AND** equivalent inputs produce equivalent stack results.

#### Scenario: Heat-tier bounds are explicit and safe
- **WHEN** heat-tier input falls outside supported bounds
- **THEN** input is clamped before stack derivation
- **AND** stack output remains valid and bounded.
