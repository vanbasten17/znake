# Design

## Key Points

### What is changing

- Neon proposal SVGs are resized/composed to occupy a near-max area inside each 40x40 marker tile with consistent padding and silhouette weight.
- Runtime marker URL resolution gains an optional overlay source (`assets/sprites/source/marker_neon_proposals/png`) enabled by `?neonPreview=1`.

### Why it matters

- Improves comparative readability when evaluating multiple tone candidates.
- Keeps score-linked items visually clear without unintended persistent glow emphasis.
- Enables fast dev iteration via a single URL toggle.

### Impacted areas

- Marker proposal source assets and generated PNG previews.
- Marker bitmap loader path selection logic.

### Risks / unknowns

- Some tones may still need artistic tuning after real-device validation.
- Query-param preview must remain opt-in to avoid accidental production look changes.

## Technical Notes

- Runtime chooses base marker URLs from generated assets.
- When `neonPreview=1`, tone-matched proposal URLs override base URLs.
- Missing proposal files still fallback to base/procedural paths through existing loader behavior.
