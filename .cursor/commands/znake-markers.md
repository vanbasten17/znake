---
name: /znake-markers
id: znake-markers
category: Tooling
description: Marker pixel pipeline — export, validate, and crisp rendering rules for Znake
---

Use the **znake-marker-pipeline** skill (`.cursor/skills/znake-marker-pipeline/SKILL.md`).

**Quick commands**

```bash
pnpm generate:sprites    # PNGs + manifest from markerRenderer + markerExportSpec
pnpm validate:markers    # manifest vs spec + checklist
```

**Single source of truth:** `src/game/render/markerExportSpec.ts`

**Human doc:** `docs/MARKER_PIXEL_PIPELINE.md`

When editing markers, glyphs, or marker-related UI, read the skill and keep **NEAREST** textures, **integer** display sizes, and **one spec** for logical/inner/scale.
