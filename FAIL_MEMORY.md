# FAIL_MEMORY.md

Purpose: capture execution failures and blockers so we can continuously improve process and AGENTS guidance.

## Usage
- Append entries; do not rewrite history.
- Keep each entry brief and concrete.
- Add an entry when a task fails, stalls, or needs retries due to avoidable process issues.

## Entry Template

### YYYY-MM-DD - short task label
- Task: <what we were trying to do>
- What failed: <clear failure or blocker>
- Root cause: <why it happened>
- Prevention rule: <specific rule to avoid repeat>
- AGENTS.md update candidate: <yes/no> - <one sentence>

## Entries

<!-- Append new entries below this line -->

### 2026-03-28 - pre-loop formatting gate failure
- Task: Seed 30 OpenSpec changes and prepare first apply cycle.
- What failed: `pnpm check` failed on Biome formatting in newly edited files.
- Root cause: Manual patches introduced style drift without running formatter before gate.
- Prevention rule: Run `pnpm check:fix` immediately after multi-file patches and before first strict loop gate.
- AGENTS.md update candidate: no - Existing guidance already covers running checks; this is execution discipline.

### 2026-03-28 - shared-id-registry format gate failure
- Task: Apply shared gameplay ID registry and run strict loop gate.
- What failed: `pnpm check` failed due Biome formatting drift in edited files.
- Root cause: Applied multi-file refactor without formatter pass before gate.
- Prevention rule: After introducing new shared modules/constants, run `pnpm check:fix` before strict `pnpm check`.
- AGENTS.md update candidate: no - Existing check guidance is sufficient; this is execution discipline.

### 2026-03-28 - enemy-strategy gate format failure
- Task: Validate enemy tick strategy routing refactor.
- What failed: `pnpm check` failed due formatter shape for a long union type line.
- Root cause: Manual patch introduced line wrapping that Biome enforces differently.
- Prevention rule: After large TS patches, run `pnpm check:fix` before strict gate.
- AGENTS.md update candidate: no - This is repeated formatting hygiene, not policy gap.

### 2026-03-28 - bottom-nav loop formatting gate failure
- Task: Implement bottom navigation menu shell and pass strict loop gate.
- What failed: `pnpm check` failed due Biome formatting in `src/game/scenes/MenuScene.ts`.
- Root cause: Manual patch introduced line wrapping that diverged from formatter output.
- Prevention rule: After touching MenuScene/UI orchestration with multi-line conditionals, run `pnpm check:fix` before strict `pnpm check`.
- AGENTS.md update candidate: no - Existing guidance is sufficient; enforce execution discipline.

### 2026-03-28 - menu-nav tests import-order gate failure
- Task: Add deterministic menu navigation tests and pass strict loop gate.
- What failed: `pnpm check` failed on import ordering/format in new menu navigation files.
- Root cause: New files were created without running unsafe import organizer required by Biome policy.
- Prevention rule: After adding new TS files/tests, run `biome check --fix --unsafe .` before strict `pnpm check`.
- AGENTS.md update candidate: no - Tooling already enforces this; execution should include unsafe fix pass when needed.

### 2026-03-28 - parallax css quote format gate failure
- Task: Implement menu depth parallax core styling and pass strict loop gate.
- What failed: `pnpm check` failed on CSS formatter quote style in `menuOverlay.module.css`.
- Root cause: Manual CSS patch used single-quote content token against formatter preference.
- Prevention rule: After CSS keyframe/pseudo-element edits, run `pnpm check:fix` before strict gate.
- AGENTS.md update candidate: no - Existing check discipline covers this case.

### 2026-03-28 - screen-shake profile import-order gate failure
- Task: Integrate screen shake safety profiles into GameScene loop.
- What failed: `pnpm check` failed on import ordering and long-line formatting in `GameScene.ts`.
- Root cause: Manual integration patch skipped Biome unsafe import organizer pass.
- Prevention rule: After touching large scene files with new imports, run `biome check --write --unsafe .` before strict `pnpm check`.
- AGENTS.md update candidate: no - This is repeated formatter discipline already covered by process.

### 2026-03-28 - screen-shake test formatting gate failure
- Task: Finalize screen shake safety profile tests and close strict loop.
- What failed: `pnpm check` failed due formatter wrapping in `tests/screen-shake-profile.test.ts`.
- Root cause: New test import line exceeded formatter style threshold.
- Prevention rule: Run `pnpm check:fix` immediately after adding new test files.
- AGENTS.md update candidate: no - Existing process guidance already covers formatter-first discipline.

### 2026-03-28 - accessibility-presets import-order gate failure
- Task: Finalize visual accessibility preset tests and close strict loop.
- What failed: `pnpm check` failed on import ordering in `tests/visual-accessibility-presets.test.ts`.
- Root cause: New test file import order required Biome unsafe organizer pass.
- Prevention rule: After adding new test files, run `biome check --write --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Existing workflow discipline already covers this.

### 2026-03-28 - damage-legibility import-order gate failure
- Task: Integrate floating damage label legibility system into GameScene.
- What failed: `pnpm check` failed on import ordering in `GameScene.ts`.
- Root cause: New typed import group order differed from Biome organizer expectations.
- Prevention rule: After adding mixed type/value imports in large scene files, run `biome check --write --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Existing formatter discipline already covers this issue.

### 2026-03-28 - hit-vfx channel formatting gate failure
- Task: Integrate semantic hit VFX channels into GameScene render loop.
- What failed: `pnpm check` failed on import order and line-wrap formatting in `GameScene.ts`.
- Root cause: Manual patch introduced formatter-divergent wrapping and type/value import order.
- Prevention rule: For large render-loop edits, run `biome check --write --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Existing process already captures this formatter discipline.

### 2026-03-28 - particle-budget profile format gate failure
- Task: Implement deterministic particle budget tiers and run strict loop gate.
- What failed: `pnpm check` failed because `particleBudget.ts` line wrapping diverged from Biome formatter.
- Root cause: New module patch was gated before running formatter.
- Prevention rule: After creating new systems modules, run `pnpm check:fix` before strict `pnpm check`.
- AGENTS.md update candidate: no - Existing workflow already mandates checks; this is execution discipline.

### 2026-03-28 - particle-budget formatter retry failure
- Task: Retry strict gate after initial particle budget format fix.
- What failed: `pnpm check` still failed; `biome check --write` did not rewrite this formatter-only difference.
- Root cause: Used check-writer path instead of explicit formatter pass for this file shape.
- Prevention rule: If `pnpm check:fix` does not clear formatter diffs, run `pnpm format` before retrying strict gate.
- AGENTS.md update candidate: no - Existing policy is enough; this is a tool-selection detail.

### 2026-03-28 - animation-cue gamescene format gate failure
- Task: Integrate anticipation/follow-through rendering cues and validate strict gate.
- What failed: `pnpm check` failed on formatter wrapping for new `enemyCenterX/Y` lines in `GameScene.ts`.
- Root cause: Manual scene patch introduced long-line formatting drift.
- Prevention rule: After render-loop edits in `GameScene.ts`, run `pnpm format` before strict `pnpm check`.
- AGENTS.md update candidate: no - Current check policy already covers this; this is execution hygiene.

### 2026-03-28 - telemetry-gateway import-order gate failure
- Task: Apply telemetry gateway interface refactor and validate strict gate.
- What failed: `pnpm check` failed on import organization and formatter shape in `telemetryEvents.ts`.
- Root cause: New mixed type/value import line required Biome unsafe import organizer.
- Prevention rule: After editing import topology in systems modules, run `pnpm exec biome check --write --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Existing process already captures this formatter/import discipline.

### 2026-03-28 - telemetry-gateway retry mismatch on import ordering
- Task: Retry strict gate for telemetry gateway refactor.
- What failed: `pnpm check` still failed due exact import ordering preference in `telemetryEvents.ts`.
- Root cause: Auto-fix path used did not converge to repository-specific import ordering expectation.
- Prevention rule: If Biome still fails after unsafe fix, patch imports to the exact suggested order before retrying gate.
- AGENTS.md update candidate: no - This is an edge-case execution detail, not a policy gap.

### 2026-03-28 - telemetry-gateway contradictory import ordering feedback
- Task: Finalize telemetry gateway loop gate.
- What failed: `pnpm check` returned import-order suggestion opposite to previous manual patch.
- Root cause: Manual patch diverged from actual organizer policy; must trust unsafe organizer output.
- Prevention rule: For import-order failures, use `biome check --fix --unsafe .` directly and avoid manual reordering.
- AGENTS.md update candidate: no - Existing tooling guidance is sufficient when followed strictly.

### 2026-03-28 - asset-loading-facade import-order gate failure
- Task: Integrate scene asset-loading facade into GameScene and validate strict gate.
- What failed: `pnpm check` failed on import ordering in `GameScene.ts`.
- Root cause: New system import insertion broke Biome organizer order.
- Prevention rule: After adding imports to `GameScene.ts`, run `pnpm exec biome check --fix --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Existing process already covers this and just needs consistent execution.

### 2026-03-28 - input-command-pipeline format/import gate failure
- Task: Integrate deterministic input command pipeline and validate strict gate.
- What failed: `pnpm check` failed on new pipeline formatter style and GameScene import ordering.
- Root cause: Manual additions in systems + large scene file skipped unsafe organizer/formatter pass.
- Prevention rule: After adding new systems modules consumed by GameScene, run `pnpm exec biome check --fix --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Existing guidance is enough; execution discipline must be stricter.

### 2026-03-28 - upgrade-strategy-registry gate formatting/import failure
- Task: Integrate upgrade strategy registry and validate strict gate.
- What failed: `pnpm check` failed on test import wrapping and GameScene import ordering.
- Root cause: New imports in large scene/test files were not normalized with unsafe organizer before gate.
- Prevention rule: After adding core imports plus new tests, run `pnpm exec biome check --fix --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Existing process already prescribes this; execution consistency is the issue.

### 2026-03-28 - domain-event-bus gate import/format failure
- Task: Integrate typed domain event bus and validate strict gate.
- What failed: `pnpm check` failed on import order in `telemetryGateway.ts` and formatter style in telemetry gateway tests.
- Root cause: New event-bus wiring and assertions were added without final unsafe organize/format pass.
- Prevention rule: After touching telemetry gateway + tests together, run `pnpm exec biome check --fix --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Process already captures this pattern; this is execution discipline.

### 2026-03-28 - scene-state-machine split import-order gate failure
- Task: Integrate loop-state-machine module into GameScene update path.
- What failed: `pnpm check` failed on import sorting in `GameScene.ts`.
- Root cause: Added new scene helper import without unsafe organizer normalization.
- Prevention rule: After adding imports under `scenes/gameScene/*`, run `pnpm exec biome check --fix --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Existing workflow already covers this pattern.

### 2026-03-28 - adaptive-room-director formatter gate failure
- Task: Apply adaptive room director and validate strict loop gates.
- What failed: `pnpm check` failed due formatter wrapping in `adaptiveRoomDirector.ts`.
- Root cause: New arithmetic line exceeded formatter style expectations.
- Prevention rule: Run `pnpm format` after adding new systems files with multi-term expressions before strict gate.
- AGENTS.md update candidate: no - Existing process already covers formatter-first discipline.

### 2026-03-28 - streak-bounty formatter gate failure
- Task: Apply streak bounty system and pass strict gates.
- What failed: `pnpm check` failed due formatter wrapping in `streakBounty.ts`.
- Root cause: New file function signature line diverged from Biome format expectation.
- Prevention rule: Run `pnpm format` immediately after adding new `systems/*.ts` files before strict `pnpm check`.
- AGENTS.md update candidate: no - Existing formatting discipline already applies.

### 2026-03-28 - streak-bounty architecture guardrail line-budget failure
- Task: Validate streak bounty system loop.
- What failed: `pnpm check` failed because `GameScene.ts` exceeded architecture line budget (5826/5800).
- Root cause: Added inline feature logic in an already near-budget scene file.
- Prevention rule: When touching `GameScene.ts` near budget, prefer extracting/compacting feature logic immediately and avoid extra inline telemetry/copy branches.
- AGENTS.md update candidate: no - Guardrail already exists and correctly caught drift.

### 2026-03-28 - streak-bounty line-budget retry still above threshold
- Task: Re-run gate after initial GameScene compaction.
- What failed: architecture guardrail still failed at 5804/5800.
- Root cause: First compaction removed too little inline code in oversized scene.
- Prevention rule: For line-budget failures, target at least 10-line reduction in one patch to avoid iterative retries.
- AGENTS.md update candidate: no - Guardrail behavior is already explicit.

### 2026-03-28 - enemy-intent telegraphs test import-order gate failure
- Task: Add deterministic telegraph tests and validate strict gate.
- What failed: `pnpm check` failed on import ordering in `enemy-intent-telegraphs.test.ts`.
- Root cause: New test file imports were not normalized with unsafe organizer.
- Prevention rule: After creating new test files, run `pnpm exec biome check --fix --unsafe .` before strict gate.
- AGENTS.md update candidate: no - Existing process guidance already covers this.


## 2026-03-28 — run-branching-objectives-v1 gate retry
- Task: Loop gate `pnpm check` after route branch presenter integration.
- What failed: Biome import-order check failed in `src/game/scenes/GameScene.ts`.
- Root cause: New import was added in a hurry without running organizer before gate.
- Prevention rule: After each `GameScene` import edit, run `biome check --write src/game/scenes/GameScene.ts` before full `pnpm check`.
- AGENTS.md update candidate: no — existing validation policy already covers this; this is execution hygiene.

### 2026-03-28 - boss-counterplay-clarity test formatting gate failure
- Task: Validate boss counterplay clarity loop after adding deterministic cue tests.
- What failed: `pnpm check` failed because `tests/boss-counterplay-clarity.test.ts` did not match formatter wrapping.
- Root cause: New multiline import was added without running formatter/organizer.
- Prevention rule: After creating any new `tests/*.test.ts`, run `pnpm biome check --write <file>` before strict gates.
- AGENTS.md update candidate: no - Existing check gate policy already catches this, execution discipline needed.

### 2026-03-28 - boss-counterplay-clarity GameScene line-budget failure
- Task: Pass strict check gate after cue integration.
- What failed: `pnpm check` failed because `GameScene.ts` exceeded architecture line budget (5809/5800).
- Root cause: Added multi-branch boss cue mapping inline in an already near-budget orchestrator file.
- Prevention rule: For GameScene changes near limit, collapse repeated branch returns into shared helper calls and single-branch exits immediately.
- AGENTS.md update candidate: no - Guardrail policy already exists; this is local execution discipline.

### 2026-03-28 - companion-drone GameScene line-budget failure
- Task: Validate companion drone integration loop.
- What failed: `pnpm check` failed because `GameScene.ts` exceeded architecture line budget (5802/5800).
- Root cause: Added cooldown field + trigger block in near-budget orchestrator.
- Prevention rule: For near-budget scene changes, compact declarations/resets in same patch to keep net lines neutral.
- AGENTS.md update candidate: no - Existing guardrail is correct; apply compacting proactively.

### 2026-03-28 - companion-drone invalid class field compaction
- Task: Recover GameScene line budget for companion drone loop.
- What failed: TypeScript parse errors after attempting comma-separated class-field declarations.
- Root cause: Applied variable declaration style that is invalid for class property syntax.
- Prevention rule: Never compact multiple class fields onto one declaration line; compact logic branches instead.
- AGENTS.md update candidate: no - This is implementation hygiene, not policy gap.

### 2026-03-28 - meta-specialization lanes formatter gate failure
- Task: Validate meta specialization lanes loop.
- What failed: `pnpm check` failed due formatter wrapping in `metaBoard.ts` and `meta-specialization-lanes.test.ts`.
- Root cause: New ternary/assert lines were not normalized by formatter before gate.
- Prevention rule: After adding new `core` helper + test pair, run `pnpm biome check --write <core-file> <test-file>` before strict gates.
- AGENTS.md update candidate: no - Existing check discipline already applies.

### 2026-03-28 - panic-recovery GameScene formatting gate failure
- Task: Validate panic resource recovery loop.
- What failed: `pnpm check` failed due formatter wrapping requirement in `updateBodyEconomyState` call.
- Root cause: Manual single-line compaction diverged from formatter contract.
- Prevention rule: After touching multi-arg calls in `GameScene`, run targeted `pnpm biome check --write src/game/scenes/GameScene.ts` before strict gate.
- AGENTS.md update candidate: no - Existing formatting gate already enforces this.

### 2026-03-28 - panic-recovery GameScene line-budget overflow
- Task: Re-run strict gate after panic recovery scene-context integration.
- What failed: `pnpm check` failed on `GameScene.ts` line budget (5803/5800).
- Root cause: Added multi-line panic context wiring to scene update loop in near-budget orchestrator.
- Prevention rule: Prefer moving arming logic into simulation resolver before adding new scene wiring when near line budget.
- AGENTS.md update candidate: no - Guardrail already covers this, and extraction solved it.

### 2026-03-28 - shrine-events test formatting gate failure
- Task: Validate risk-reward shrine events loop.
- What failed: `pnpm check` failed due formatter wrapping in `event-choices-simulation.test.ts`.
- Root cause: New shrine test used long inline find expression not normalized before gate.
- Prevention rule: After appending tests to long existing files, run `pnpm biome check --write <test-file>` before strict gate.
- AGENTS.md update candidate: no - Existing process guidance already applies.
