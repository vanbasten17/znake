## ADDED Requirements

### Requirement: Scene overlay semantic color consistency
The system SHALL apply shared semantic token families to key readability cues across menu and run-adjacent overlays.

#### Scenario: Key overlay cues use shared semantic tokens
- **WHEN** menu, death, reward, upgrade, or relic overlays render key semantic text accents
- **THEN** those accents use shared semantic token families for danger/heal/economy/control/elite intent
- **AND** scene flow and interaction behavior remain unchanged

#### Scenario: Mobile and desktop readability remains clear
- **WHEN** semantic token mappings are applied on portrait mobile and desktop
- **THEN** cue text remains readable and distinguishable
- **AND** no gameplay-state ownership moves into scene style logic
