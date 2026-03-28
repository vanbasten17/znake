## Why

Prevents instrumentation leaks into core systems and eases schema evolution.

## Key Points (Codex-style)

- What is changing
  - Wrap telemetry emitters behind gateway interfaces with contract tests.
- Why we are doing it
  - Prevents instrumentation leaks into core systems and eases schema evolution.
- Impacted areas
  - Telemetry emitters, analytics schema, devtools.
- Risks / unknowns
  - Missing adapters can silently drop events without strict checks.

## What Changes

- Wrap telemetry emitters behind gateway interfaces with contract tests.
- Define OpenSpec requirements and implementation tasks for Telemetry Gateway Interface.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- 
affected spec: `observability`

## Impact

- Affected code (expected):
  - 
  - 
  - 
- No dependency changes required for proposal stage.
