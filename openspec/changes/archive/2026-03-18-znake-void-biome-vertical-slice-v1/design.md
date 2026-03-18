## Context

To move from prototype to product-grade feel, we need depth that players can immediately perceive in a single run. A biome slice concentrates visual and mechanic polish into one coherent package.

## Goals / Non-Goals

**Goals:**
- Deliver one end-to-end biome identity in runtime gameplay.
- Keep implementation data-driven and tunable through balance config.
- Preserve existing run-loop flow and controls.

**Non-Goals:**
- Multiple biome routing/selection.
- New scene architecture or content pipeline.

## Decisions

- Reuse current `GameScene` and layer biome systems into it for iteration speed.
- Add `BALANCE.biome` knobs for hazard cadence, special spawn rates, and boss settings.
- Extend enemy model with `kind` and `health` to support stalker and mini-boss behavior.
- Keep boss encounter deterministic by floor interval.

## Risks / Trade-offs

- [Risk] More mechanics in one scene may increase complexity. -> Mitigation: isolate with small helper methods and balance config groups.
- [Risk] Boss cadence could spike difficulty too sharply. -> Mitigation: centralize boss values and tune quickly in one file.
