## Context

The game already emits generic feedback events, but lethal collision events can feel ambiguous in fast runs.

## Decisions

- Add `crash` as a distinct feedback kind with stronger vibration pattern and lower/harsher tone envelope.
- Map death reasons:
  - `wall`, `self`, `enemy` -> `crash`
  - `rift` -> keep `danger`

## Risks / Mitigations

- Risk: cue may be too aggressive on some devices.
  - Mitigation: keep cue short, bounded gain, and tune after playtest if needed.
