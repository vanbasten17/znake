## ADDED Requirements

### Requirement: Bounded depth-balance progression contract
The system SHALL provide a bounded deterministic progression contract for floors 1-15 with explicit early, mid, and late pressure targets.

#### Scenario: Floor progression maps to stable depth bands
- **WHEN** gameplay resolves progression pressure for a floor within the bounded 1-15 window
- **THEN** it resolves against a deterministic depth-band contract (`early`, `mid`, `late`)
- **AND** the same seed and input stream yields the same floor pressure outcomes

#### Scenario: Depth-band pressure targets remain readable
- **WHEN** progression transitions between depth bands
- **THEN** pressure increase remains intentional and readable rather than abrupt
- **AND** transition tuning preserves practical counterplay windows under normal encounter density

### Requirement: Level-band difficulty guardrails
The system SHALL enforce level-band guardrails that reduce spike deaths and flat pacing segments without introducing dynamic nondeterministic difficulty.

#### Scenario: Guardrails dampen abrupt pressure spikes
- **WHEN** per-floor pressure deltas exceed configured level-band thresholds
- **THEN** deterministic guardrail logic clamps or smooths the affected values
- **AND** gameplay remains challenging while avoiding near-instant unjust difficulty jumps

#### Scenario: Guardrails avoid flat low-pressure stretches
- **WHEN** contiguous floors stay below configured minimum pressure progression for a band
- **THEN** deterministic guardrail logic raises bounded pressure values for subsequent floors
- **AND** progression keeps a meaningful sense of advancement

### Requirement: Depth-aware item usefulness
The system SHALL keep in-run item usefulness meaningful by resolving spawn/value policy from depth band and run context.

#### Scenario: Item usefulness scales by depth and context
- **WHEN** item spawn and effect usefulness are resolved during run progression
- **THEN** the resolved policy includes depth-band and run-context factors (objective pressure and room context)
- **AND** early, mid, and late floors each retain practical item decision value
