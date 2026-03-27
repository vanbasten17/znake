## Context

Current styles combine shared tokens with many per-file literals, causing drift in semantic meaning (for example, danger/economy/control accents differ by overlay). This follow-up standardizes semantic tokens and migrates critical readability paths to those tokens while keeping existing layout and gameplay contracts intact.

## Key Points (Codex-style)

- **What is changing**: Add semantic token families and migrate HUD/scene readability colors to token-driven values.
- **Why we are doing it**: Consistent color semantics reduce cognitive load and improve at-a-glance threat/reward parsing.
- **Impacted areas**: `tokens.css`, `app.css`, `menuOverlay`, `deathOverlay`, `rewardOverlay`, `upgradeOverlay`, `relicDraftOverlay`.
- **Risks / unknowns**: Contrast regressions on certain backgrounds if token values are not tuned carefully.

## Goals / Non-Goals

**Goals:**
- Define stable semantic token values for danger/heal/economy/control/elite families.
- Replace high-impact semantic literals in HUD and core overlays with those tokens.
- Preserve existing structure, interactions, and gameplay behavior.
- Keep desktop and portrait-mobile readability clear.

**Non-Goals:**
- Full visual redesign.
- Gameplay logic or balance changes.
- Typography/layout overhauls outside token usage.

## Decisions

1. **Semantic token-first migration**
   - Decision: Introduce semantic CSS variables and map existing literals to them.
   - Why: Enables consistency and easier iteration.
   - Alternative considered: per-file manual color cleanup only; rejected due to future drift.

2. **Readability-critical paths first**
   - Decision: Prioritize HUD statuses/pulses and overlay key labels over exhaustive replacement.
   - Why: Maximum readability impact with minimal risk.
   - Alternative considered: full file-wide replacement; rejected as unnecessary churn.

3. **Behavior-neutral visual update**
   - Decision: Keep logic untouched; color changes only.
   - Why: Avoid gameplay regression and keep audit scope tight.
   - Alternative considered: coupling with gameplay cues logic changes; rejected by scope.

## Risks / Trade-offs

- **[Risk] Contrast regressions on bright glows** → Mitigation: tune token values against current backgrounds and retain text-shadow where needed.
- **[Risk] Partial migration inconsistency** → Mitigation: cover all primary HUD and major scene overlay surfaces in this pass.
- **[Risk] Mobile crowding from brighter cues** → Mitigation: keep existing font sizes/layout and only update colors.

## Migration Plan

1. Add semantic token variables in `tokens.css`.
2. Migrate `app.css` HUD status/pulse and voice-state colors to semantic tokens.
3. Migrate key semantic accents in scene overlay styles to semantic tokens.
4. Run `pnpm check` + `pnpm build` and verify no layout/behavior regressions.

Rollback strategy: revert token additions and style substitutions file-by-file if readability regresses.

## Open Questions

- Should gameplay world sprite colors eventually consume a shared semantic mapping object too?
- Do we want color-vision-specific semantic palettes in a follow-up accessibility change?
