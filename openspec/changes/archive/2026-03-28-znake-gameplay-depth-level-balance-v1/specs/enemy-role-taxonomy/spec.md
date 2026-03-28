## ADDED Requirements

### Requirement: Depth-aware role composition cadence
The system SHALL resolve enemy role composition cadence by depth band so encounter variety increases with progression while preserving role readability.

#### Scenario: Role cadence policy varies by depth band
- **WHEN** enemy role composition is resolved for spawn cadence within floors 1-15
- **THEN** role weights/caps/gaps are selected from depth-band role policy
- **AND** deeper bands can increase composition variety without violating role contract limits

#### Scenario: Role readability contracts remain preserved under depth tuning
- **WHEN** depth-band role policy increases pressure or role overlap potential
- **THEN** telegraph and counterplay readability minima remain enforced for active roles
- **AND** tuning does not obscure role identity or collapse readable counterplay windows

### Requirement: Deterministic depth-band role outcomes
Role cadence outcomes SHALL remain deterministic for identical seed, depth-band config, and simulation inputs.

#### Scenario: Same seed yields same depth-band composition outcomes
- **WHEN** two runs share the same seed, depth-band role policy, and input stream
- **THEN** role composition cadence outcomes match across floors
- **AND** scene render/update ordering does not alter role cadence resolution
