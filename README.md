# Znake

Roguelite Snake prototype restructured as a production-ready TypeScript project with Phaser, `pnpm`, and Biome.

## Stack

- Phaser 3 for gameplay and rendering
- Vite for local dev and production bundling
- TypeScript in strict mode
- Biome for formatting and linting

## Quick Start

```bash
pnpm install
pnpm dev
```

## Scripts

```bash
pnpm dev        # run local game dev server
pnpm build      # typecheck + production build
pnpm preview    # preview production build
pnpm check      # biome lint + formatting checks
pnpm check:fix  # biome auto-fix
pnpm format     # format all files
pnpm generate:sprites   # export procedural marker PNGs + manifest (see docs/assets/MARKER_PIXEL_PIPELINE.md)
pnpm validate:markers   # verify manifest vs markerExportSpec + crisp-pixel checklist
```

**Glossary / marker art pipeline:** `docs/assets/MARKER_PIXEL_PIPELINE.md` — dimensions live in `src/game/render/markerExportSpec.ts`. Cursor: skill **`znake-marker-pipeline`**, command **`/znake-markers`**.

**World & lore (synthesized from current game):** [docs/WORLD_AND_LORE.md](docs/WORLD_AND_LORE.md)

**Asset & sprite docs (index):** [docs/assets/README.md](docs/assets/README.md)

## Project Structure

```text
src/
  game/
    core/       # constants, shared types, persistent run state, upgrades
    scenes/     # Menu, Game, Upgrade, Death scenes
    systems/    # DOM HUD + touch/mouse/keyboard input bridge
    phaser.ts   # Phaser bootstrap config
  styles/
    app.css     # responsive mobile-first shell and controls
  main.ts       # app entrypoint
```
