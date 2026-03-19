## Design Summary

We adopt a portrait-first internal canvas and split run-time vertical space using a stable CSS grid:

- Row 1: HUD (auto)
- Row 2: gameplay area (2fr)
- Row 3: touch controls (1fr)
- Row 4: hint bar (auto)

For keyboard mode, touch controls remain hidden and the gameplay row expands to fill available space.

## Stitch Alignment

We use the provided polished references:

- `ZNAKE Main Menu Polished` (`200cb0d9479d4fee964ec677ec9c506d`)
- `ZNAKE Relic Selection Polished` (`1da98f443e364c5cb619759a629af0b0`)

Layout decisions favor portrait composition and spacing density from those references while preserving scene behavior.

## Technical Notes

- Update core dimensions to a portrait-oriented ratio.
- Use scene classes (`scene-run` / `scene-menu`) to apply mode-specific shell layout.
- Ensure canvas fit logic prefers full game-area height in run scenes without breaking desktop keyboard usage.
- Adjust menu/relic/upgrade anchors to prevent copy overlap on the taller canvas.
