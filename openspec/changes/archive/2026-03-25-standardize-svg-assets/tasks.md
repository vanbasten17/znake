## 1. Pipeline Infrastructure

- [x] 1.1 Refine `tools/svg-to-png.ts` to strictly default to `assets/sprites/generated/` and handle existing PNG overrides gracefully
- [x] 1.2 Implement `--dry-run` flag in `tools/svg-to-png.ts` to output to a temporary `assets/sprites/previews` folder
- [x] 1.3 Update `package.json` with `sprites:dry-run` and `sprites:update` scripts

## 2. Source Asset Migration

- [x] 2.1 Refine `assets/sprites/source/marker_core.svg` to perfectly match "Premium Squared Neon" style (2px borders, 20x20 logic)
- [x] 2.2 Refine `assets/sprites/source/marker_venom.svg` with proper liquid shading and neon glow
- [x] 2.3 Create SVG sources for remaining high-priority markers (`shield`, `portal`, `beacon`)

## 3. Agent Tooling (Skills)

- [x] 3.1 Create `.agent/skills/asset-dry-run/SKILL.md` documenting the procedure for AI agents to dry-run SVG changes
- [x] 3.2 Implement a helper script (or refine existing one) that takes an SVG input and returns a temporary PNG buffer/path for agent visibility

## 4. Finalization & Validation

- [x] 4.1 Run `pnpm sprites:svg2png` for all migrated assets
- [x] 4.2 Rebuild the global markers atlas via `node --import tsx tools/pack-marker-atlas-from-pngs.ts`
- [x] 4.3 Validate the whole pipeline results with `pnpm validate:markers`
