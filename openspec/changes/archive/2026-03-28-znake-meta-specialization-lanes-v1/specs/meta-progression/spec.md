## ADDED Requirements

### Requirement: Meta progression supports tradeoff specialization lanes

The system SHALL derive specialization-lane status deterministically from unlocked meta talents.

#### Scenario: Lane specialization state derives from unlocked tiers
- **WHEN** profile unlocked talents are evaluated per lane branch
- **THEN** lane specialization resolves to locked, balanced, or committed deterministically
- **AND** equivalent profile state yields equivalent lane status output.

#### Scenario: Dominant lane marker is deterministic and tie-safe
- **WHEN** one lane has uniquely highest unlocked tier count
- **THEN** dominant lane marker is enabled for that lane
- **AND** ties do not mark any lane as dominant.
