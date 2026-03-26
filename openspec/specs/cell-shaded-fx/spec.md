# cell-shaded-fx Specification

## Purpose
TBD - created by archiving change hand-drawn-neon-fusion. Update Purpose after archive.
## Requirements
### Requirement: Posterized Bloom Falloff
The PostFX pipeline MUST support a "quantize" step that limits the bloom glow to 3-4 distinct brightness levels instead of a smooth exponential falloff.

#### Scenario: Cell Glow Bands
- **WHEN** the glow intensity is ~0.4 (default)
- **THEN** at least three distinct concentric "bands" of light MUST be visible around the segment.

### Requirement: Ink Outlining
The PostFX pipeline MUST incorporate a "Laplacian" or "Sobel" filter (or a similar edge detection technique applied to the scene depth/color) to draw thick, dark "inking" lines around high-contrast areas.

#### Scenario: Hit Impact Inking
- **WHEN** a collision occurs or screen shake is active
- **THEN** the ink outlines MUST momentarily "jitter" and thicken to 4px to signal impact.

