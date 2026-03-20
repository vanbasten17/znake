## Design

- Update `shield` case in `drawVectorIconCanvas` and `drawVectorIconPhaser` within `markerVectorArt.ts`.
- Use stronger silhouette:
  - rounded shield body with downward-pointing tip
  - no center cross
- Maintain existing color tokens from `PAINT.shield`.
- Add a new dev scenario preset (`reference_board`) in `devScenarios.ts`.
- In `GameScene`, when the scenario is active:
  - freeze normal simulation ticks (snake/enemy/objective progression),
  - render a deterministic reference layout (snake, walls, hazards, enemies, key pickups),
  - expose hover labels (mouse) for each reference marker.

## Non-goals

- No changes to marker semantic roles.
- No balance changes in normal runs.
