## ADDED Requirements

### Requirement: Stitch-to-Phaser devtool

The system SHALL provide an internal development tool to map Stitch screen data into Phaser-friendly layout artifacts.

#### Scenario: Tool runs from repository tooling path

- **WHEN** developer executes the mapper CLI from `tools/stitch-phaser-mapper`
- **THEN** the tool reads Stitch input and emits normalized layout output
- **AND** no runtime `src/` dependency is introduced

#### Scenario: Tool emits mapping diagnostics

- **WHEN** generated layout risks overlap or overflow
- **THEN** output includes explicit diagnostics/warnings for adjustment

#### Scenario: Tool emits Phaser guidance output

- **WHEN** developer requests Phaser output mode
- **THEN** tool provides code-oriented snippet suggestions for scene construction
