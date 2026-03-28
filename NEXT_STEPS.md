# Next Steps

## Active Ideas

No active ideas.

## OpenSpec Match Status

Generated: 2026-03-28

- `Route choice risk forecast readability`
  - Status: `Implemented`
  - Change: `openspec/changes/archive/2026-03-28-2026-03-28-znake-route-risk-forecast-v1/`
  - Evidence:
    - `openspec/changes/archive/2026-03-28-2026-03-28-znake-route-risk-forecast-v1/proposal.md`
    - `openspec/changes/archive/2026-03-28-2026-03-28-znake-route-risk-forecast-v1/design.md`
    - `openspec/changes/archive/2026-03-28-2026-03-28-znake-route-risk-forecast-v1/tasks.md`
    - `openspec/specs/run-map/spec.md`
    - `src/game/simulation/routeRiskForecast.ts`
    - `src/game/scenes/GameScene.ts`
    - `src/game/systems/i18nResources.ts`
    - `tests/route-risk-forecast.test.ts`

- `Challenge share-code deterministic integrity contract and telemetry`
  - Status: `Implemented`
  - Change: `openspec/changes/archive/2026-03-28-2026-03-28-znake-challenge-share-code-contract-v1/`
  - Evidence:
    - `openspec/specs/challenge-presets/spec.md`
    - `openspec/specs/observability/spec.md`
    - `src/game/core/challengeShare.ts`
    - `tests/challenge-share-code.test.ts`

- `Localized challenge-share prompt copy + URL-safe body compatibility`
  - Status: `Implemented`
  - Change: `openspec/changes/archive/2026-03-28-2026-03-28-znake-challenge-share-menu-compat-v1/`
  - Evidence:
    - `openspec/specs/input-hud/spec.md`
    - `openspec/specs/scenes/spec.md`
    - `openspec/specs/challenge-presets/spec.md`
    - `src/game/scenes/MenuScene.ts`
    - `src/game/systems/challengeSharePromptCopy.ts`
    - `src/game/systems/i18nResources.ts`
    - `src/game/core/challengeShare.ts`
    - `tests/challenge-share-prompt-copy.test.ts`

## Completed

- [x] Add route-choice risk forecast readability
  - Why: Improves route commit clarity and fairness by making immediate pressure legible before players lock in a path.
  - OpenSpec change: `2026-03-28-znake-route-risk-forecast-v1`
  - [x] Research fit with modern roguelite/tactics readability patterns and map it to Znake route cards.
  - [x] Create OpenSpec artifacts (`proposal.md`, `design.md`, `tasks.md`) with Key Points section.
  - [x] Add run-map spec delta for deterministic route risk forecast readability.
  - [x] Add deterministic helper and route-card forecast line (`LOW`/`MEDIUM`/`HIGH`).
  - [x] Add deterministic tests for risk scoring thresholds.
  - [x] Run validation (`pnpm check`).
  - [x] Archive completed change and confirm updated base spec.

- [x] Challenge share-code contract + deterministic parser coverage
  - Why: Protects player challenge-sharing reliability and fairness diagnostics with explicit integrity rules and deterministic tests.
  - OpenSpec change: `2026-03-28-znake-challenge-share-code-contract-v1`
  - [x] Create OpenSpec artifacts (`proposal.md`, `design.md`, `tasks.md`) with Key Points section.
  - [x] Add spec deltas for challenge-share contract and observability lifecycle telemetry.
  - [x] Harden parser to accept case-insensitive prefix while preserving checksum/payload strictness.
  - [x] Add deterministic regression tests for round-trip, checksum mismatch, invalid payload version, and normalization defaults.
  - [x] Run validation (`pnpm check`).

- [x] Localize challenge-share prompt copy in menu flow
  - Why: Improves readability/accessibility for non-English users and removes hardcoded UX text from scene orchestration.
  - OpenSpec change: `2026-03-28-znake-challenge-share-menu-compat-v1`
  - [x] Add OpenSpec deltas for `input-hud`/`scenes` copy contract around challenge share prompts.
  - [x] Move `window.prompt` challenge-share strings in `MenuScene` to i18n resources with deterministic fallback behavior.
  - [x] Add deterministic coverage for localized fallback behavior.

- [x] Add URL-safe challenge-share payload compatibility
  - Why: Reduces copy/paste failure risk when challenge codes pass through URL or chat platforms that rewrite base64 characters.
  - OpenSpec change: `2026-03-28-znake-challenge-share-menu-compat-v1`
  - [x] Add OpenSpec delta in `challenge-presets` for URL-safe body normalization boundaries.
  - [x] Extend parser normalization for `-`/`_` body variants without relaxing checksum or payload validation.
  - [x] Add deterministic tests for URL-safe import equivalence.

## Suggested Next Step

No active ideas remain. Trigger this skill again to start another brainstorming cycle.
