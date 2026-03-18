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
```

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
