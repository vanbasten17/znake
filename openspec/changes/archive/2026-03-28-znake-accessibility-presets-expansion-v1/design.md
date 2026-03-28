## Context

The project already supports visual accessibility classes but menu controls disable those toggles by default. A first-pass preset expansion should activate these controls while keeping storage and rendering contracts simple.

## Key Points (Codex-style)

- What is changing
  - Add preset resolver/cycle logic and expose visual settings in menu.
- Why we are doing it
  - Increase practical accessibility discoverability and player control.
- Impacted areas
  - Accessibility system state mapping, menu action rows, translations.
- Risks / unknowns
  - Mixed manual toggles require clear preset status.

## Goals / Non-Goals

**Goals:**
- Enable visual accessibility controls now.
- Keep persistence and body-class pipeline unchanged.
- Support explicit preset + manual override workflow.

**Non-Goals:**
- Full WCAG audit pass.
- New rendering shader pipeline for accessibility.
- Audio accessibility profile work.

## Decisions

### Decision: Keep preset state derived, not separately persisted
- Resolve preset id from current visual setting tuple.
- Rationale: avoids duplication and drift.

### Decision: Support `custom` preset label
- Show `custom` when manual toggles diverge from predefined presets.
- Rationale: transparent state communication.

## Risks / Trade-offs

- [Risk] Preset cycling surprises users with multiple changes at once. -> Mitigation: explicit preset row label and preserved manual toggles.

## Migration Plan

1. Add preset helper logic.
2. Enable visual rows in menu accessibility section.
3. Add localized preset labels.
4. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Re-disable visual menu controls and remove preset helper APIs.
