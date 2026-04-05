## Context

Telemetry currently captures many events but balance analysis still requires manual stitching. A concise normalized snapshot can improve signal quality while keeping performance bounded.

## Key Points (Codex-style)

- What is changing
  - Introduce a normalized telemetry snapshot schema for balance-relevant moments.
- Why we are doing it
  - Speed up balance iteration and reduce interpretation ambiguity.
- Impacted areas
  - Observability contracts, telemetry gateway, analytics consumers.
- Risks / unknowns
  - Schema growth can raise payload volume if unbounded.

## Goals / Non-Goals

Goals:
- Standardize balance-critical payload shape.
- Preserve deterministic event derivation from simulation state.
- Keep emission overhead low and bounded.

Non-Goals:
- Standalone analytics pipeline buildout.
- Long-term warehouse schema migration.

## Decisions

### Decision: Snapshot envelope with versioned fields
- Emit a stable envelope with a version tag and compact typed fields.
- Rationale: enables iterative extension without consumer breakage.

### Decision: Event-gated emission points
- Emit snapshots at objective completion, major damage spikes, rerolls, and run end.
- Rationale: high signal density with controlled volume.

## Risks / Trade-offs

- Risk: Consumer lag during schema version transition.
- Trade-off: Better tuning velocity with moderate contract maintenance cost.
