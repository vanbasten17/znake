## ADDED Requirements

### Requirement: System reduced-motion preference is respected

The UI foundation SHALL treat OS/browser reduced-motion preference as an accessibility signal.

#### Scenario: System preference enables reduced effects
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** reduced-effects behavior is enabled without requiring manual menu toggles
- **AND** gameplay logic remains unchanged.

### Requirement: Interactive controls meet minimum target-size baseline

Interactive controls SHALL expose a shared target-size baseline token for pointer usability.

#### Scenario: Shared controls apply minimum target baseline
- **WHEN** menu/run controls render
- **THEN** they apply shared min-size constraints based on tokenized target guidance.
