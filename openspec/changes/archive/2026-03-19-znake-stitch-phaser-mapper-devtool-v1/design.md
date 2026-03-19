## Context

We already use Stitch as visual source of truth, but Phaser scenes are hand-built.
The goal is to provide a practical "developer copilot" tool, not a strict production compiler.

## Design

- Location:
  - `tools/stitch-phaser-mapper/`
- Inputs:
  - Stitch screen JSON export (or extracted metadata payload)
  - target scene size (default current game canvas)
- Pipeline:
  1. Parse Stitch nodes into a canonical node tree.
  2. Normalize coordinates to relative metrics.
  3. Infer simple constraints (fixed, stretch, center, stack).
  4. Generate:
     - normalized layout JSON
     - Phaser code suggestions for text + framed blocks
  5. Run overlap/fit diagnostics.
- Output modes:
  - `--json` (normalized layout + diagnostics)
  - `--phaser` (code snippets)

## Non-Goals (v1)

- Full WYSIWYG parity.
- Runtime integration.
- Scene auto-rewrite in-place.

## Risks / Mitigations

- Risk: incomplete Stitch metadata for certain elements.
  - Mitigation: graceful fallback with warnings and partial output.
- Risk: overfitting to one screen.
  - Mitigation: generic normalized model + diagnostics-first approach.
