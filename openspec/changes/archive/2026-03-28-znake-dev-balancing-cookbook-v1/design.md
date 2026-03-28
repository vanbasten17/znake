## Context

The project has rich deterministic tuning surfaces but no single playbook for connecting telemetry symptoms to safe knob adjustments. A lightweight cookbook keeps tuning decisions focused and reversible.

## Key Points (Codex-style)

- What is changing
  - Introduce a practical balancing reference with daily loop and rollback rules.
- Why we are doing it
  - Improve balancing throughput while preserving fairness and determinism.
- Impacted areas
  - Internal docs and contributor workflow.
- Risks / unknowns
  - Without updates, recommendations may lag behind system evolution.

## Goals / Non-Goals

**Goals:**
- Provide deterministic balancing loop.
- Map common signals to specific balance knobs.
- Include validation and rollback guidance.

**Non-Goals:**
- New runtime balancing features.
- Automated balancing tooling.
- External analytics dashboard implementation.

## Decisions

### Decision: Keep cookbook concise and action-oriented
- Focus on immediate signal -> tuning -> validation mapping.
- Rationale: maximizes day-to-day usability.

### Decision: Link from README
- Keep entry path obvious for all contributors.
- Rationale: reduce documentation discoverability friction.

## Risks / Trade-offs

- [Risk] Cookbook may be interpreted as exhaustive policy. -> Mitigation: include bounded scope and iteration framing.

## Migration Plan

1. Add cookbook doc.
2. Link in README.
3. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Remove cookbook and README link if direction changes.
