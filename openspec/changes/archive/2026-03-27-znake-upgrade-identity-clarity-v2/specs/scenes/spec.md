## MODIFIED Requirements

### Requirement: Upgrade selection polished composition

The system SHALL render upgrade selection in a portrait-first polished composition aligned with the approved reference while clearly surfacing family identity and decision context.

#### Scenario: Upgrade selection fits vertical layout

- **WHEN** floor-clear upgrade scene is shown
- **THEN** title, subtitle, and three upgrade cards fit without overlap
- **AND** card hit zones remain fully interactive

#### Scenario: Upgrade selection uses DOM vertical slice

- **WHEN** upgrade scene is active
- **THEN** upgrade selection content is rendered via DOM overlay in the game area
- **AND** scene behavior (pick flow, transitions, keyboard shortcuts) remains equivalent

#### Scenario: Upgrade cards show family identity

- **WHEN** upgrade choices are shown
- **THEN** each card communicates the upgrade family and short gameplay purpose
- **AND** tradeoff-oriented copy remains readable without inspecting external menus

#### Scenario: Upgrade cards separate identity and consequence cues

- **WHEN** upgrade choices are rendered
- **THEN** card hierarchy presents family identity context separately from per-upgrade consequence cues
- **AND** playstyle and tradeoff consequence text can be compared quickly on supported mobile and desktop layouts
