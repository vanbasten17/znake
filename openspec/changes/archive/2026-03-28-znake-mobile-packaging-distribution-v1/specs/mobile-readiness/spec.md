## ADDED Requirements

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

