## Context

Znake currently uses inline formulas and probabilities in gameplay scenes and meta services. This works for prototyping but makes balancing expensive and error-prone. A central balance config improves iteration speed and consistency.

## Goals / Non-Goals

**Goals:**
- Centralize balance knobs in one module.
- Keep consumption simple in runtime code.
- Allow balancing passes by editing a single file.

**Non-Goals:**
- Live remote config.
- Designer UI tooling in this iteration.

## Decisions

- Add `src/game/core/balance.ts` as the authoritative balance source.
- Expose named groups:
  - floor scaling
  - spawn chances
  - economy coefficients
  - talent costs
- Add helper function(s) for derived floor settings.
- Update scene/meta code to consume config values, not literals.

## Risks / Trade-offs

- [Risk] Over-centralization can hide context if names are poor. -> Mitigation: keep config grouped and descriptive.
- [Risk] Behavior regressions when moving formulas. -> Mitigation: preserve existing formulas initially, validate with build and gameplay smoke tests.
