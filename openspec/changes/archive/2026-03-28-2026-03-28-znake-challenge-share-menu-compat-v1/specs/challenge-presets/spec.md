## ADDED Requirements

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
