## Context

Current movement/control hints are static and don’t expose whether user intent is buffered or temporarily blocked by cooldowns. A small additive hint cue set can improve perceived responsiveness.

## Key Points (Codex-style)

- What is changing
  - Add two bounded confidence cues to default run hints.
- Why we are doing it
  - Support fast decision-making in tight windows.
- Impacted areas
  - `refreshHintText`, localization strings.
- Risks / unknowns
  - Hint text could become noisy during heavy modifier moments.

## Goals / Non-Goals

**Goals:**
- Preserve deterministic logic.
- Keep cues compact and context-aware.
- Avoid adding new UI widgets.

**Non-Goals:**
- Input system rewrite.
- New cooldown meters.
- Touch control redesign.

## Decisions

### Decision: Reuse hint bar channel
- Add confidence fragments only when relevant.
- Rationale: fastest path and low rendering risk.

### Decision: Contextual cooldown source
- Use venom cooldown when venom context is active, else body-pulse cooldown.
- Rationale: aligns cue with currently relevant ability system.

## Risks / Trade-offs

- [Risk] Localized cue length can overflow on small layouts. -> Mitigation: short labels and bounded fragments.

## Migration Plan

1. Add confidence fragment logic to hint composer.
2. Add localized cue strings.
3. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Remove fragment logic and new hint keys.
