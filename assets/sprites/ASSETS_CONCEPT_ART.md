# Znake Asset Concept Art & Visual Language

This document defines the "Premium Squared Neon" aesthetic for the game's assets (markers, powerups, enemies). All future assets must follow these principles to maintain visual consistency.

## 1. Core Visual Principles

The aesthetic is a fusion of **retro-futuristic geometry** and **modern neon vibrance**. It avoids organic curves in favor of bold, functional silhouettes.

### Key Pillars:
- **Iconic Geometry**: Use simple primitives (squares, circles) combined into recognizable forms. No complex gradients or hand-drawn textures.
- **The "Znake Border"**: Every asset must have a thick, solid dark inner border (typically 2px at 40x40 scale) to separate it from the background.
- **Functional Color**: Colors are semantic and signify the object's role in the game (Benefit vs. Hazard).
- **Flat Shading**: Depth is achieved through 2-3 shades of a color or horizontal "liquid" bands, rather than smooth gradients.
- **Pixel Sharpness**: Assets should stay inside a 20x20 logical grid inside the 40x40 frame (scaled 2x), ensuring pixel-perfect alignment.

---

## 2. Reference Benchmarks

Analysis of our gold-standard markers:

### Marker: Core (The Apple)
- **Geometry**: A squircle (rounded square).
- **Outline**: Thick 2px black inner stroke. 
- **Body**: Solid Vibrant Red (#FF3131).
- **Accents**: Geometric stem (white) and flat green leaf. Minimalist and bold.
- **Vibe**: Clean, "premium" geometric fruit. Iconic.

### Marker: Venom (The Toxic Potion)
- **Geometry**: Stacked square blocks (bottle body + neck).
- **Outline**: 2px dark border with a high-saturation neon-green outer glow.
- **Body**: Dark green base with horizontal bands representing liquid levels.
- **Iconography**: Central skull glyph simplified to basic primitives (circle, dots).
- **Vibe**: Toxic, high-tech/cyberpunk potion. 

---

## 3. Style Guide for New Assets

### Frame & Layout
- **Target Resolution**: 40x40 px (runtime).
- **Logical Canvas**: 20x20 units.
- **Safe Zone**: 2px padding on all sides to avoid edge clipping.
- **Alignment**: Align horizontal and vertical lines to integer units.

### Color Palette (Semantic Mapping)
| Role | Theme | Colors |
|------|-------|--------|
| **Benefit** | Rescue / Power | Cyan (#00FFFF), Gold (#FFD700), Neon Pink (#FF69B4) |
| **Hazard** | Toxic / Danger | Neon Green (#39FF14), Dark Purple (#4B0082) |
| **Enemy** | Hostile | Magenta (#FF00FF), Neon Orange (#FF5F1F) |
| **Utility** | System | White (#FFFFFF), Slate Gray (#708090) |

---

## 4. Asset Pipeline

Our pipeline moves from high-fidelity vector source to crisp, runtime-ready raster files.

1. **Source**: Author vector files in `assets/sprites/source/` as **.svg**.
2. **Naming**: Use `marker_<tone>.svg` to match game logic (e.g., `marker_core.svg`).
3. **Generation**: Run `pnpm sprites:svg2png` to render to `assets/sprites/generated/`.
4. **Integration**: The script replaces existing procedural PNGs, promoting authored art to "first-class" assets.
5. **Validation**: Run `pnpm validate:markers` to ensure the manifest is in sync.
