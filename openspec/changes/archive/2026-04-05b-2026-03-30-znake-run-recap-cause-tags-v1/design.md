## Context

Players improve faster when failures are explained with clear, concise causes. Recap should highlight top causes without turning into a data dump.

## Key Points (Codex-style)

- What is changing
  - Add structured cause tags to run recap and history entries.
- Why we are doing it
  - Improve player learning loops and strategic adaptation.
- Impacted areas
  - Run history surface, death recap summaries, telemetry labeling.
- Risks / unknowns
  - Overly granular tags may overwhelm players.

## Goals / Non-Goals

Goals:
- Surface top 2-3 cause tags per run.
- Keep tag derivation deterministic from recap signals.
- Preserve readability with short labels and glossary mapping.

Non-Goals:
- Full combat log playback.
- Replacing existing narrative recap text.

## Decisions

### Decision: Weighted-cause ranking
- Cause tags are ranked by weighted impact scores from run events.
- Rationale: objective and testable selection behavior.

### Decision: Tag budget cap
- Display at most three tags in primary recap.
- Rationale: prevents information overload.

## Risks / Trade-offs

- Risk: Early tag weighting can misattribute player perception.
- Trade-off: Better learning clarity with modest model tuning overhead.
