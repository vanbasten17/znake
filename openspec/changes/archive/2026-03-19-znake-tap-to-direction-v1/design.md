## Context

Current touch controls can miss side intent. Absolute swipe steering is clearer and robust for one-hand play.

## Goals / Non-Goals

**Goals:**

- Allow touch steering by relative turning gestures.
- Keep movement deterministic and grid-safe.
- Preserve existing keyboard and virtual input contracts.

**Non-Goals:**

- Analog movement.
- Multi-touch gesture combos.
- UI changes beyond input behavior.

## Decisions

1. Input layer publishes absolute swipe direction intent.
- Horizontal swipe maps to `left`/`right`.
- Vertical swipe maps to `up`/`down`.

2. GameScene consumes absolute directions through existing queue path.
- Reuses `virtualInput.dir` path with anti-reverse safeguards.

3. Keep anti-reverse and queue limits as-is.
- Reuses existing `_pushDir` behavior for safety.

## Risks / Trade-offs

- [Risk] Vertical swipe noise could cause unintended turns.
  - Mitigation: vertical-dominant swipes are handled as absolute `up`/`down`, and minimum swipe distance is enforced.
- [Risk] Overlay button gestures could trigger movement.
  - Mitigation: input ignores taps whose target is inside a button.
