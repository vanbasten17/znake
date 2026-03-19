## Context

ZNAKE already has a strong neon identity, but gameplay readability is the next bottleneck for fairness and skill expression.

This slice focuses on visual signatures, not mechanics.

## Goals / Non-Goals

**Goals:**

- Make each interactive gameplay entity distinguishable in <250ms glance.
- Preserve existing collision and progression behavior.
- Keep mobile-first readability under motion and squeeze pressure.

**Non-Goals:**

- Full art pipeline replacement.
- DOM-based runtime rendering for moving gameplay entities.
- New gameplay systems.

## Decisions

1. Keep gameplay entities rendered in Phaser canvas.
- Do not migrate snake/walls/collectibles to DOM Elements.
- Preserve deterministic frame-to-grid relationship.

2. Improve readability with multi-channel cues.
- Shape (silhouette)
- Value/contrast (head > body, hazards clearly separated)
- Motion accent (pulse/glow frequency differences)

3. Keep palette tokenized and coherent with existing shell.
- Reuse current color system; adjust only where contrast is insufficient.

## Risks / Trade-offs

- [Risk] Over-stylizing could reduce performance on low-end phones.
  - Mitigation: constrain extra effects to lightweight fills/strokes and minimal particle overhead.

- [Risk] Visual changes may alter perceived difficulty.
  - Mitigation: no mechanic changes in this slice; only readability cues.
