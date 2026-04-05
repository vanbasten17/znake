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

#### Scenario: Autoloop report includes versioned metadata for traceability

- **WHEN** `autoloop` writes `.autoloop/loop-report.json`
- **THEN** report includes a `loopVersion` field
- **AND** version value is stable within a release so automation consumers can validate expected schema

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

### Requirement: Release candidate gate contract
The system SHALL define a release candidate gate contract that requires engineering, visual, and asset-quality checks before candidate approval.

#### Scenario: Engineering gate enforces baseline checks
- **WHEN** a release candidate is evaluated
- **THEN** gate evaluation requires successful `pnpm check` execution
- **AND** requires successful production build validation for release-targeted candidates
- **AND** candidate approval is blocked when any required engineering check fails

#### Scenario: Autonomous loop includes deterministic smoke evidence

- **WHEN** autonomous loop mode is used for implementation quality checks
- **THEN** gate output includes deterministic smoke playtest metrics artifact
- **AND** artifacts include pass/fail status and threshold comparisons for reproducible auditing

### Requirement: Release gate metadata consistency
The release gating flow SHALL require a shared metadata tuple across all gate outputs.

#### Scenario: Gate artifacts include release metadata tuple
- **WHEN** gate outputs are produced for a release candidate
- **THEN** outputs include `release_version`, `release_channel`, and `build_id`
- **AND** missing tuple fields result in gate failure status

### Requirement: Channel-aware packaging workflow contract
The system SHALL provide a minimal tooling workflow contract for channel-aware distribution packaging.

#### Scenario: Packaging workflow exposes channel-specific execution path
- **WHEN** a developer triggers a packaging workflow for `dev`, `stage`, or `prod`
- **THEN** workflow emits artifacts and evidence labeled with the selected release channel
- **AND** workflow requires release metadata tuple fields for the target channel

### Requirement: Distribution checklist artifacts are tooling-managed
The system SHALL keep candidate/release checklist artifacts in a stable tooling-visible location.

#### Scenario: Checklist templates are available for candidate and release phases
- **WHEN** developers prepare candidate or release submissions
- **THEN** repository tooling/docs expose checklist templates for signing and distribution readiness
- **AND** checklist templates include reviewer and date metadata fields

### Requirement: Release metadata generation for launch surfaces
The system SHALL provide deterministic release metadata outputs consumable by menu transparency UI and launch-page surfaces.

#### Scenario: Build metadata includes version and channel
- **WHEN** launch bundle metadata is generated
- **THEN** output includes semantic app version and release channel fields
- **AND** values are consistent between in-app menu display and launch-page display surfaces

#### Scenario: Metadata generation fails clearly on invalid configuration
- **WHEN** required release metadata inputs are missing or malformed
- **THEN** tooling reports actionable validation errors before release artifacts are considered ready
- **AND** failure mode does not alter gameplay build determinism

### Requirement: Shared balancing cookbook for deterministic iteration

The system SHALL provide a developer-facing balancing cookbook that maps common gameplay signals to deterministic tuning actions and validation steps.

#### Scenario: Contributor follows cookbook for a tuning pass
- **WHEN** contributor performs a balancing iteration
- **THEN** cookbook provides signal-to-knob mapping, validation checklist, and rollback rules
- **AND** workflow emphasizes bounded deterministic changes over broad ad-hoc tweaks

### Requirement: Architecture guardrail checks for iteration speed

The system SHALL provide tooling checks that surface architecture-boundary and complexity-budget regressions during development.

#### Scenario: Simulation side-effect boundaries are checked

- **WHEN** project checks run on changes touching gameplay simulation modules
- **THEN** tooling reports forbidden side-effect usage in `simulation/*` (for example direct DOM/window/localStorage/Phaser dependencies)
- **AND** check output is actionable for fast remediation

#### Scenario: Scene complexity-budget drift is reported

- **WHEN** scene files exceed agreed complexity budgets (for example file length/import count thresholds)
- **THEN** tooling reports budget breaches with file-level context
- **AND** output encourages extraction-first remediation in subsequent apply slices

### Requirement: Deterministic fairness validation suite
The system SHALL provide a deterministic, seed-based fairness validation suite that evaluates reaction-window, recoverability, and cheap-hit risk metrics across depth bands.

#### Scenario: Suite runs deterministically from centralized inputs
- **WHEN** developer runs fairness validation tooling with default suite inputs
- **THEN** evaluation uses centralized seed and threshold tables
- **AND** equivalent code/config state yields equivalent results

#### Scenario: Suite emits concise evidence artifact
- **WHEN** fairness validation completes
- **THEN** output includes per-depth-band pass/fail summaries and bounded metric values
- **AND** artifact is concise and machine-readable for tuning loops

### Requirement: Check pipeline emits stable stage labels

The system SHALL enforce this contract as part of the znake-tooling-check-output-contract-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.

### Requirement: Loop telemetry records retries and gate outcomes

The system SHALL enforce this contract as part of the znake-tooling-loop-telemetry-schema-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.

### Requirement: Runtime devtools state stays isolated from simulation state

The system SHALL enforce this contract as part of the znake-devtools-runtime-state-boundaries-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.

### Requirement: Failure memory entries follow concise standard template

The system SHALL enforce this contract as part of the znake-tooling-failure-memory-entry-standard-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.

### Requirement: Content consumers depend on repository interfaces, not concrete loaders
Runtime content consumers SHALL resolve content packs through repository ports so loaders remain replaceable in tests and future tooling flows.

#### Scenario: Default repository preserves existing pack resolution
- **WHEN** runtime requests a content pack through the repository port without custom injection
- **THEN** resolution behavior and fallback semantics match the current default content-pack resolver
- **AND** deterministic run setup remains unchanged.

#### Scenario: Injected repository can override content source in deterministic tests
- **WHEN** a custom repository implementation is injected into the content resolution port
- **THEN** runtime consumers receive the injected resolved pack payload
- **AND** the port contract keeps stable `pack` and `fallbackApplied` fields.

### Requirement: Tooling provides deterministic reusable scenario fixtures

The tooling system SHALL expose deterministic reusable scenario fixtures for tests.

#### Scenario: Test constructs a baseline combat-economy scenario
- WHEN a test requests a named scenario fixture
- THEN the fixture returns canonical seeded state builders
- AND repeated fixture construction yields deterministic equivalent state

