## Context

The product plan requires dependable observability to evaluate retention, balance, and UX quality. Existing telemetry is useful but partial, especially around death causes and progression decisions.

## Goals / Non-Goals

**Goals:**
- Ensure each run emits a minimum analytics envelope covering start, play progression, and end.
- Capture failure and survival metrics with low implementation risk.
- Include control mode context for mobile-vs-keyboard behavior analysis.

**Non-Goals:**
- Remote analytics transport or backend integration.
- Dashboarding/BI implementation.

## Decisions

- Emit `death_reason` and `time_alive` at death trigger in gameplay runtime.
- Emit `upgrade_picked` and `floor_reached` in upgrade transition.
- Emit `input_mode` at run start points (menu and death restart).
- Keep events in the existing in-memory telemetry pipeline (`trackRetentionEvent`).

## Risks / Trade-offs

- [Risk] Duplicate events from repeated inputs near transitions. -> Mitigation: keep existing scene guards and waiting flags.
- [Risk] Event semantics drift over time. -> Mitigation: codify required events in OpenSpec observability spec.
