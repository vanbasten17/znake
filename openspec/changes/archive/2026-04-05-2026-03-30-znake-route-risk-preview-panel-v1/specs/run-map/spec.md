## ADDED Requirements

### Requirement: Route selection presents deterministic risk preview bands

The system SHALL expose a deterministic route-risk preview before route lock-in.

#### Scenario: Player inspects route options before commit
- WHEN route options are presented
- THEN each route shows one configured risk band and concise reason tags
- AND the same seed and state produce the same preview labels
