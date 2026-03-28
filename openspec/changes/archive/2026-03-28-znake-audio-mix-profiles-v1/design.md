## Context

The game already emits deterministic audio/haptic cues for feedback events, but lacks user-selectable mix intensity. A profile-based scaling layer can remain deterministic while improving comfort.

## Key Points (Codex-style)

- What is changing
  - Add profile-aware multipliers to feedback output.
  - Expose profile selection in menu accessibility section.
- Why we are doing it
  - Give players control over feedback intensity/fatigue.
- Impacted areas
  - Accessibility persistence and feedback emission path.
- Risks / unknowns
  - Reduced profile may under-communicate important events.

## Goals / Non-Goals

**Goals:**
- Keep behavior deterministic and bounded.
- Reuse existing settings storage path.
- Keep UX lightweight (single-cycle row control).

**Non-Goals:**
- Full audio mixer implementation.
- Per-event custom sliders.
- New music/ambience channels.

## Decisions

### Decision: Profile-based multipliers only
- Adjust gain, duration, and vibration intensity with bounded multipliers.
- Rationale: minimal complexity with meaningful effect.

### Decision: Keep profile in accessibility settings
- Persist alongside existing accessibility preferences.
- Rationale: same user-facing control area and storage path.

## Risks / Trade-offs

- [Risk] Focused profile may become too sharp on some devices. -> Mitigation: conservative multiplier bounds.
- [Risk] Low-fatigue profile could hide urgent cues. -> Mitigation: retain pattern shape while scaling intensity.

## Migration Plan

1. Add `audioProfile` setting and cycle helper.
2. Add menu control row and localized labels.
3. Apply multipliers in feedback emitter.
4. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Remove `audioProfile` usage and restore static feedback mix.
