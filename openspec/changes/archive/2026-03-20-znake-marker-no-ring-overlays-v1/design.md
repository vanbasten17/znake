## Design

- Scope: in-game marker rendering only (`GameScene.drawFrame`).
- Remove ring/stroke circle overlays for:
  - food core marker
  - portal markers
  - rift marker
  - powerup markers
  - biome item markers
- Keep glow fills and marker texture sprites (`markerTextureKey(...)`) unchanged.

## Non-goals

- No changes to marker atlas assets or marker semantics.
- No gameplay, balance, or progression changes.
