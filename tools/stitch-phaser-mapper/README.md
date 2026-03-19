# Stitch → Phaser Mapper (Devtool)

Internal helper tool to accelerate design-to-scene iteration from Stitch data.
This tool is development-only and does not run in game runtime.

## What it does

- Parses a Stitch-like screen JSON payload.
- Normalizes nodes to relative layout metrics.
- Infers simple constraints (`left/center/right/stretch`, `top/center/bottom/stretch`).
- Emits:
  - normalized JSON layout
  - Phaser snippet suggestions
  - overlap + fit diagnostics

## Usage

```bash
pnpm stitch:map -- \
  --input tools/stitch-phaser-mapper/examples/screen.sample.json \
  --json /tmp/stitch-layout.json \
  --phaser /tmp/stitch-phaser-snippets.ts \
  --width 768 \
  --height 1376
```

## Input expectations

The parser is permissive and looks for common fields:

- `width`, `height`
- `children[]`
- node fields: `x`, `y`, `width`, `height`, `text`, `name`, `fillColor`, `strokeColor`, `borderRadius`

If some fields are missing, the tool falls back gracefully and still emits partial output + diagnostics.

## Notes

- Generated snippets are guidance, not production-ready final code.
- Always review and adjust typography, spacing, and visual tone in scene code.
