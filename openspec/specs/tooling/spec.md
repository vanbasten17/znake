# tooling Specification

## Purpose
TBD - created by archiving change znake-stitch-phaser-mapper-devtool-v1. Update Purpose after archive.
## Requirements
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

### Requirement: SVG-to-PNG marker conversion devtool

The system SHALL provide an internal CLI workflow to convert authored marker SVG files into PNG outputs compatible with the current marker replacement pipeline.

#### Scenario: Batch conversion runs from tooling command

- **WHEN** developer runs `pnpm sprites:svg2png`
- **THEN** all SVG files in the input folder are converted to PNG files in the output folder
- **AND** each output keeps the source basename with `.png` extension

#### Scenario: Conversion supports pipeline-aligned resolution

- **WHEN** developer runs conversion without explicit size
- **THEN** generated PNG size defaults to the marker pipeline replacement resolution
- **AND** command supports explicit `--size` override for preview or custom exports

#### Scenario: Replacement path is documented for generated marker assets

- **WHEN** developer wants to replace in-game marker sprites with converted PNGs
- **THEN** docs describe where to place files, how to rebuild atlas, and how to validate consistency

### Requirement: Simulation invariants test coverage

The system SHALL provide automated tests for extracted pure simulation logic and persistence migrations.

#### Scenario: Deterministic simulation tests run without Phaser

- **WHEN** automated tests execute for simulation modules
- **THEN** tests import pure TypeScript logic only
- **AND** verify invariants such as connectivity, spawn safety, and RNG repeatability

#### Scenario: Profile migration tests validate version transitions

- **WHEN** profile versioning logic is tested
- **THEN** migrations from older profile versions to current are validated
- **AND** invalid payloads fallback safely to defaults without throwing

### Requirement: Internal gameplay debug controls

The system SHALL provide low-risk internal devtools hooks for deterministic iteration.

#### Scenario: Devtools expose run seed and restart with same seed

- **WHEN** game runs in development mode
- **THEN** internal debug surface exposes current seed and a restart action preserving that seed

#### Scenario: Devtools expose slow-motion toggle

- **WHEN** developer toggles sim speed from debug controls
- **THEN** gameplay update timing applies a slow-motion multiplier without changing core rules

### Requirement: Enemy/objective simulation deterministic tests

The project SHALL provide deterministic tests for pure enemy and objective simulation modules.

#### Scenario: Enemy movement tests are deterministic

- **WHEN** enemy simulation tests run with fixed seeds/inputs
- **THEN** resulting movement/collision decisions are reproducible across runs

#### Scenario: Objective timers tests are deterministic

- **WHEN** objective simulation tests run with fixed timer progressions
- **THEN** portal/core-pressure state transitions match expected event outputs

### Requirement: Replay capture model tests

The project SHALL validate replay capture ordering and seed linkage.

#### Scenario: Replay capture preserves intent order

- **WHEN** inputs are appended to capture
- **THEN** events remain ordered by append sequence and relative time
- **AND** capture seed remains attached to run metadata

