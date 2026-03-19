## Context

We need one modifier MVP that is easy to tune and safe to ship incrementally.

Darkness should be deterministic, readable, and centralized in balance config.

## Goals / Non-Goals

**Goals:**

- Add darkness as an opt-in floor modifier via balance config.
- Keep implementation low-risk and fully deterministic.
- Preserve current run flow and objective systems.

**Non-Goals:**

- Multiple modifiers in one change.
- Dynamic lighting/shadow system with expensive render passes.
- Any change to collision or spawn rules.

## Decisions

1. Modifier activation is data-driven.
- Configure start floor + cadence + radius in `BALANCE`.

2. Render darkness as a lightweight grid overlay.
- Per-cell overlay outside head visibility radius.
- No heavy post-processing pipeline.

3. Boss floors are exempt by default.
- Keep boss readability and telegraphing explicit.

## Risks / Trade-offs

- [Risk] Darkness can feel unfair on small screens.
  - Mitigation: conservative default radius and boss exemption.

- [Risk] Overlay can hide objective-critical cues too strongly.
  - Mitigation: tune alpha falloff and validate manually on mobile viewport.
