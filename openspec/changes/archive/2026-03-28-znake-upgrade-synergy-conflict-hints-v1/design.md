## Context

Upgrade cards already expose identity, gameplay intent, and tradeoff copy, but players still parse multiple lines to compare options. A compact chip row can surface "what this works with" and "what this risks" faster while preserving existing architecture and data.

## Key Points (Codex-style)

- What is changing
  - Add two compact hint chips derived from existing upgrade metadata.
- Why we are doing it
  - Improve upgrade draft scanning speed and reduce choice friction.
- Impacted areas
  - UpgradeScene UI construction and overlay CSS.
- Risks / unknowns
  - Potential card-height pressure on small screens.

## Goals / Non-Goals

**Goals:**
- Expose explicit synergy/conflict cues per card.
- Keep behavior deterministic and presentation-only.

**Non-Goals:**
- Rebalance upgrades.
- Add new upgrade metadata fields.

## Decisions

### Decision: Derive chips from existing fields
- Use `upgrade.synergy` and `upgrade.tradeoff` fallback copy.
- Rationale: avoids schema churn and keeps localization fallback behavior intact.

### Decision: Keep chip labels concise and fixed
- Use `SYNERGY` and `CONFLICT` labels for rapid scan.
- Rationale: stable visual grammar for quick comparisons.

## Risks / Trade-offs

- [Risk] Card layouts become too tall on narrow devices. -> Mitigation: compact chip sizing and wrapping.
- [Risk] Hint duplication with existing text. -> Mitigation: keep chips short and preserve deeper lines below.

## Migration Plan

1. Add synergy accessor in UpgradeScene.
2. Add chip-row rendering in card composition.
3. Add compact chip styles in upgrade overlay CSS.
4. Validate with check/smoke/spec validation/build.

Rollback strategy:
- Remove chip row and helper; existing identity/gameplay/tradeoff lines remain.

## Open Questions

- Should future iterations infer conflict severity tiers from tags for stronger visual contrast?
