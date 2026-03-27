## ADDED Requirements

### Requirement: HUD semantic pulse mapping consistency
The system SHALL map HUD pulse/readability states to shared semantic token families consistently.

#### Scenario: Pulse states use semantic families
- **WHEN** HUD pulse kinds (`danger`, `pickup`, `reward`) are shown
- **THEN** each state resolves to its corresponding semantic token family
- **AND** objective/run status cues remain readable without layout changes
