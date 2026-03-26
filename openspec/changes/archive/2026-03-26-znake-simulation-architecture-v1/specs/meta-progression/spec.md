## MODIFIED Requirements

### Requirement: Persistent profile

The system SHALL load and persist profile state through explicit versioned migrations.

#### Scenario: Migration chain upgrades older profile versions

- **WHEN** stored profile payload version is older than current profile schema
- **THEN** ordered migration steps upgrade payload to current schema
- **AND** upgraded profile is validated before being used by runtime

#### Scenario: Unsafe payloads fallback safely

- **WHEN** stored profile payload is malformed or migration fails validation
- **THEN** runtime falls back to safe default profile
- **AND** backup payload path remains available as secondary recovery source
