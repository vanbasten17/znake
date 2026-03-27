## Why

Color semantics exist at the spec level, but implementation still mixes hardcoded values across HUD and overlays, which weakens readability and learnability under pressure. We should align color language consistently without changing gameplay behavior.

## Key Points (Codex-style)

- **What is changing**: Introduce/normalize semantic color tokens and apply them consistently across HUD and key scene overlays for danger/heal/economy/control/elite meanings.
- **Why we are doing it**: Players should parse intent instantly; consistent color language improves fairness and decision speed.
- **Impacted areas**: Shared style tokens, HUD status/pulse states, menu/death/upgrade/reward/relic overlay text accents.
- **Risks / unknowns**: Over-normalization could reduce visual variety; token mapping must preserve contrast on portrait mobile and desktop.

## What Changes

- Add explicit semantic color token families for danger, heal, economy, control, and elite.
- Replace key hardcoded HUD/overlay semantic colors with shared tokens while preserving layout/interaction behavior.
- Keep gameplay logic unchanged and focus on readability-only visual consistency.
- Validate consistency with `pnpm check` and `pnpm build` and verify readability on desktop/mobile layouts.

## Capabilities

### New Capabilities

- `color-language-consistency`: Shared semantic color-language application contract for UI/readability flows.

### Modified Capabilities

- `ui-foundation`: Semantic color token layer is extended and used consistently.
- `input-hud`: HUD status and pulse states use semantic token mapping.
- `scenes`: Menu/death/reward/upgrade/relic scene overlays apply consistent semantic colors.

## Impact

- Affected files: `src/styles/tokens.css`, `src/styles/app.css`, and relevant overlay module styles.
- Potentially affected readability hooks: HUD status cues and overlay emphasis styles only.
- No gameplay behavior changes and no new dependencies expected.
