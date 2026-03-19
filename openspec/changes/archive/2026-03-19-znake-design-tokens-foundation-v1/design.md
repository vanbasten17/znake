## Design Summary

Create a token contract in `src/styles/tokens.css` and consume it from `app.css`.

Token groups:

- Colors (surface, accent, text, border, overlays)
- Typography (font families, key font sizes)
- Spacing scale
- Radius scale
- Glow/shadow presets
- Z-index layers
- Motion timings/easing
- Layout constants (max width, shell ratios)

## Adoption Strategy

- Step 1: define canonical tokens and legacy aliases for compatibility.
- Step 2: convert existing shell styles to token usage.
- Step 3: keep visuals stable to avoid gameplay regression.

## Notes

- This is foundation-only.
- CSS Modules migration and DOM menu components come in later changes.
