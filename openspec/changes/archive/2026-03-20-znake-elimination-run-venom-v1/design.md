## Design

### Scope

- Reuse existing `kills` objective as elimination run type.
- Add a minimal venom charge and projectile loop.

### Elimination Behavior

- On `kills` objective floors:
  - disable food spawn
  - keep enemies/objective target flow
  - seed venom opportunity early

### Venom MVP

- New powerup type: `venom`
- Collecting venom grants `venomCharges += 1`
- Player can fire venom manually:
  - keyboard: `E`
  - touch: double-tap on gameplay area
- Firing consumes one charge and starts cooldown.
- Projectile advances in straight line and damages first enemy hit.

### Guide / i18n

- Add `power_venom` glossary entry (en/ca) and visual marker.

### Non-goals

- Poison trail upgrade path.
- Full multi-projectile weapon system.
