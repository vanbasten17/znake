## Design

### Goals

- Introduce room-based variety without destabilizing collision/spawn fairness.
- Preserve deterministic fallback to current classic behavior.

### Approach

1. Add `floorTemplate` to `FloorSetup` from `getFloorSetup`.
2. In `GameScene.create`:
   - resolve selected template from setup
   - if `rooms_v1`, attempt room layout generation up to N tries
   - on failure, use classic generator
3. Room layout model:
   - Build 3-5 axis-aligned rooms (bounded sizes, non-overlapping)
   - Connect rooms by Manhattan corridors
   - Mark zone sets (`roomCells`, `corridorCells`)
   - Derive walls as complement of walkable cells within inner bounds
4. Zone-aware spawns:
   - food prefers room cells
   - enemies prefer corridor endpoints/room edges away from spawn center
   - powerups/biome items use any safe walkable cell
5. Emit telemetry `floor_template_selected` with floor/template/fallback flags.

### Data/Interface Changes

- Add type alias `FloorTemplate = 'classic' | 'rooms_v1'`.
- Extend `FloorSetup` with `floorTemplate`.
- Add internal `RoomTemplateLayout` structure in `GameScene` (no persistence).

### Risks and Mitigations

- Risk: disconnected map causes impossible runs.
  - Mitigation: explicit BFS connectivity check before accepting template.
- Risk: unfair early collisions on narrow corridors.
  - Mitigation: safe spawn distance constraints and fallback retries.
