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

## Quick mental model

- `src/game/core/**` and `src/game/simulation/**` contain gameplay rules and deterministic run logic.
- `src/game/scenes/**` orchestrates flow and lifecycle; scenes should not own gameplay rules.
- `src/game/systems/**` bridges UI/input/telemetry and presentation adapters.
- `src/game/render/**`, `src/game/visual/**`, and `src/styles/**` are rendering and visual layers.
- `tests/**/*.test.ts` contains deterministic regression coverage for behavior and contracts.
- `AGENTS.md` is the operational source of truth for routing, constraints, and validation gates.

## Common tasks

### Fix a bug without changing gameplay balance
- Work in: `src/game/core/**`, `src/game/simulation/**`, and only minimal glue in `src/game/systems/**` or `src/game/scenes/**`.
- Add/update: targeted deterministic test in `tests/**/*.test.ts`.
- Do not break: balance values in `src/game/core/balance.ts`, scene-orchestrator boundaries.
- Validate: `pnpm check` (plus `pnpm test` if gameplay/domain logic changed).

### Change gameplay safely
- Work in: `src/game/core/**`, `src/game/simulation/**`, then `src/game/systems/**` for adapters.
- Add/update: deterministic tests in `tests/**/*.test.ts` (fixed seeds when randomness is involved).
- Do not break: scene orchestration boundaries (`src/game/scenes/**` should stay orchestration-only).
- Validate: `pnpm check && pnpm test` (add `pnpm build` for risky/systemic changes).

### Make a rendering/UI-only change
- Work in: `src/game/systems/**`, `src/styles/**`, and optionally `src/game/render/**`.
- Add/update: presenter/contract tests in `tests/**/*.test.ts` when behavior changes.
- Do not break: gameplay rules in `core/simulation`; avoid embedding game logic in scenes/UI files.
- Validate: `pnpm check` (add `pnpm test` if presenter/system logic changed).

### Verify a risky change
- Work in: verify touched paths plus their tests (`tests/**/*.test.ts`) and guardrail scripts (`tools/**` via `pnpm check`).
- Focus on: cross-layer edits, lifecycle/timing-sensitive logic, and architecture-sensitive changes.
- Do not skip: required normalization/check/test/build gates for high-risk work.
- Validate: `pnpm check && pnpm test && pnpm build`.

### Work through OpenSpec behavior changes
- Work in: active change files in `openspec/changes/<change>/*` and base specs in `openspec/specs/**`, then code in routed layers.
- Keep flow: update artifacts first, then implement in `core/simulation`, then wire via `systems/scenes` only as needed.
- Do not use by default: `openspec/changes/archive/**` during implementation.
- Validate: `pnpm check && pnpm test` (and `pnpm build` when change is risky/systemic).

### Update assets or tools
- Work in: `tools/**`, `src/game/render/**`, `src/game/visual/**`, `assets/**`, `docs/assets/**`.
- Run: relevant asset validators (`pnpm validate:markers`, `pnpm validate:visual-language`) when applicable.
- Do not break: runtime gameplay logic or deterministic sim flow.

## Validation matrix

For JS/TS code edits, run this normalization path before strict checks:

```bash
pnpm exec biome check --write --unsafe .
pnpm format
```

| Change type | Minimum validation | Notes |
| --- | --- | --- |
| Docs only (`README`, docs text) | None required | Optional sanity read |
| Tiny code edit (localized, no behavior intent) | `pnpm check` | Keep diff minimal and scoped |
| UI/rendering only (`systems`, `styles`, `render`, scene presentation wiring) | `pnpm check` | Add a short manual verification note |
| Localized logic change (`core`, `simulation`, shared gameplay behavior) | `pnpm check && pnpm test` | Prefer deterministic tests and fixed seeds |
| Behavior/significant change | `pnpm check && pnpm test && pnpm smoke` | Use smoke when behavior impact is broad |
| Risky/architecture-sensitive change (cross-layer, lifecycle-heavy) | `pnpm check && pnpm test && pnpm build` | Keep scope small; verify scene guardrails |

## Risky areas

- `src/game/core/balance.ts`: gameplay balance and progression sensitivity.
- `src/game/core/**` and `src/game/simulation/**`: deterministic/stateful gameplay behavior.
- `src/game/scenes/GameScene.ts`: large orchestrator with strict architecture guardrails.
- `tools/fairness-validation.ts` and fairness-related tests: fairness regressions are easy to miss.
- Timing/state-sensitive flows in scene lifecycle and loop state modules (`src/game/scenes/gameScene/**`).
- OpenSpec behavior lineage: active change artifacts vs base specs must stay aligned (`openspec/changes/<change>/*`, `openspec/specs/**`).

## Working with Codex Desktop App

- Treat `AGENTS.md` as the source of truth for architecture, routing, and validation policy.
- If `graphify-out/GRAPH_REPORT.md` exists, read it before broad file searches.
- Prefer small, safe, incremental changes over broad rewrites.
- Follow the routing guide: modify the lowest valid layer first and keep scene changes orchestration-only.
- Respect existing skills in `.codex/skills/**` and reuse them before introducing new workflow instructions.
- For behavior changes, use OpenSpec context in `openspec/specs/**` and active `openspec/changes/<change>/*`.
- Use the graph report to narrow context, then open only the smallest relevant file set.
- Run the minimal required validation from the matrix before handoff.
- See `docs/AI_CONTEXT_GRAPH.md` for the OpenSpec + Graphify workflow.

## Scripts

```bash
pnpm dev        # run local game dev server
pnpm build      # typecheck + production build
pnpm preview    # preview production build
pnpm test       # deterministic test suite
pnpm check      # biome checks + architecture guardrails + fairness validation
pnpm check:fix  # biome auto-fix
pnpm format     # format all files
pnpm graphify:build   # build/update Graphify knowledge graph output
pnpm graphify:report  # print graphify-out/GRAPH_REPORT.md path (fails if missing)
pnpm graphify:clean   # remove generated graphify-out/ directory
pnpm smoke      # scripted smoke playtest
pnpm generate:sprites   # export procedural marker PNGs + manifest (see docs/assets/MARKER_PIXEL_PIPELINE.md)
pnpm validate:markers   # verify manifest vs markerExportSpec + crisp-pixel checklist
pnpm validate:visual-language # visual-language consistency checks
```

### Graphify CLI compatibility note

Some Graphify CLI builds do not support positional mode (`graphify .`) and require
`graphify update .` instead. If you want `graphify .` to work in zsh, add this
reversible shim to `~/.zshrc`:

```bash
# Compatibility shim: map `graphify .` to `graphify update .`
graphify() {
  if [ "$1" = "." ]; then
    command /Users/mrabat/.local/pipx/venvs/graphifyy/bin/graphify update .
  else
    command /Users/mrabat/.local/pipx/venvs/graphifyy/bin/graphify "$@"
  fi
}
```

**Glossary / marker art pipeline:** `docs/assets/MARKER_PIXEL_PIPELINE.md` — dimensions live in `src/game/render/markerExportSpec.ts`. Cursor: skill **`znake-marker-pipeline`**, command **`/znake-markers`**.

**World & lore (synthesized from current game):** [docs/WORLD_AND_LORE.md](docs/WORLD_AND_LORE.md)

**Asset & sprite docs (index):** [docs/assets/README.md](docs/assets/README.md)

**Dev balancing cookbook:** [docs/DEV_BALANCING_COOKBOOK.md](docs/DEV_BALANCING_COOKBOOK.md)

## Project Structure

```text
src/
  game/
    core/       # gameplay/domain rules and persistent run state
    simulation/ # deterministic simulation systems (spawn, RNG, pathing, objectives)
    scenes/     # Phaser orchestration and lifecycle wiring
    systems/    # UI/input/telemetry bridges and presenters
    render/     # rendering helpers and marker/shader plumbing
    visual/     # visual language definitions
    shared/     # shared gameplay IDs and cross-layer constants
    config/     # content/config selectors and repositories
    phaser.ts   # Phaser bootstrap config
  styles/
    *.css       # app shell + overlay styling
tools/          # validation, smoke, asset, and automation scripts
tests/          # deterministic and contract tests
  main.ts       # app entrypoint
```
