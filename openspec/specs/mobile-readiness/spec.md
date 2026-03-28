# mobile-readiness Specification

## Purpose
TBD - created by archiving change znake-mobile-readiness-v1. Update Purpose after archive.
## Requirements
### Requirement: Lifecycle-safe gameplay pause

The system SHALL preserve mobile UX quality with safe-area-aware UI placement and lightweight startup behavior.

#### Scenario: Safe-area spacing is respected

- **WHEN** app runs on devices with notches or home indicators
- **THEN** HUD, controls, and hint sections include safe-area inset padding

#### Scenario: Engine boot is deferred

- **WHEN** app entry script executes
- **THEN** Phaser bootstrap loads through dynamic import and handles load failure gracefully

### Requirement: Mobile feedback and persistence hardening

The system SHALL provide best-effort tactile/audio feedback and resilient profile persistence behavior.

#### Scenario: Touch interactions emit feedback

- **WHEN** mobile input buttons are pressed
- **THEN** feedback system attempts haptic and lightweight audio cues

#### Scenario: Profile persistence uses fallback

- **WHEN** primary profile payload is unavailable or malformed
- **THEN** loader attempts backup payload before defaulting profile state

### Requirement: Portrait-first gameplay canvas

The system SHALL use a portrait-first internal game canvas ratio for mobile-oriented composition.

#### Scenario: Portrait ratio is active

- **WHEN** Phaser game is created
- **THEN** internal width/height ratio is portrait-oriented (height greater than width)
- **AND** run scenes can place gameplay and overlays without vertical overlap

### Requirement: Release device QA matrix contract
The system SHALL define a minimal release candidate device QA matrix and pass/fail decision policy for mobile launch readiness.

#### Scenario: Device matrix defines mandatory coverage set
- **WHEN** a release candidate enters QA validation
- **THEN** QA uses a documented minimal matrix covering at least one low-tier Android portrait device, one modern Android device, and one current iOS portrait device class
- **AND** each matrix entry includes OS/version and form-factor metadata

#### Scenario: Candidate pass/fail is derived from matrix outcomes
- **WHEN** matrix QA results are recorded
- **THEN** release candidate status is `pass` only when all mandatory matrix entries pass blocker criteria
- **AND** failed mandatory entries block candidate approval until revalidation succeeds

### Requirement: Mobile lifecycle gate verification for release candidates
The system SHALL include lifecycle sanity verification in release candidate QA outcomes.

#### Scenario: Background/foreground lifecycle checks are required
- **WHEN** release candidate QA runs on matrix devices
- **THEN** testers verify pause/resume and input safety across background/foreground transitions
- **AND** lifecycle regressions that risk stuck input or lost state are classified as release blockers

### Requirement: Packaging-specific QA baseline
The system SHALL define minimal QA checks specific to packaged shell builds beyond web-only validation.

#### Scenario: Packaged QA covers shell launch and lifecycle stability
- **WHEN** packaged candidate QA is executed
- **THEN** QA verifies launch, background/foreground behavior, and input stability under packaged shell runtime
- **AND** blocker defects in lifecycle/input stability fail candidate readiness

### Requirement: Packaging candidate pass/fail policy
The system SHALL define pass/fail decision criteria for packaging-targeted candidate validation.

#### Scenario: Candidate pass requires all mandatory packaging QA checks
- **WHEN** candidate QA results are evaluated
- **THEN** candidate status is `pass` only when all mandatory packaging checks pass
- **AND** failed mandatory checks block progression to release distribution

### Requirement: Mobile launch-surface readability and link safety
The system SHALL keep launch-facing legal/support/platform links readable and interaction-safe on portrait mobile layouts.

#### Scenario: Launch-support links remain tap-safe on mobile
- **WHEN** launch-adjacent menu or launch page links are shown on touch devices
- **THEN** tap targets meet mobile readability and spacing guardrails
- **AND** links avoid overlap with safe-area constrained controls

#### Scenario: Mobile launch copy preserves readability hierarchy
- **WHEN** launch-facing copy is rendered on narrow portrait viewports
- **THEN** positioning hook, controls summary, and support/legal labels preserve clear hierarchy
- **AND** content remains usable without horizontal scrolling

