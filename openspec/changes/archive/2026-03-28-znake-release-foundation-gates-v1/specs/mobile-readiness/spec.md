## ADDED Requirements

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

