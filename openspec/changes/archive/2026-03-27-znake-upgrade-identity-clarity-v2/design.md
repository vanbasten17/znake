## Context

Current upgrade cards already expose family, gameplay text, and tradeoff text, but family summary and consequence copy can blend together, making fast comparison harder than necessary. The lowest-risk v2 approach is to improve metadata clarity and card hierarchy while preserving deterministic draft flow.

## Key Points (Codex-style)

- **What is changing**
  - Family definitions include explicit tradeoff guidance in addition to summary identity.
  - Upgrade cards separate family identity, playstyle consequence, and tradeoff consequence.
  - Localization adds concise labels that improve scan speed.
- **Why we are doing it**
  - Make strategy implications legible at pick time, not after trial-and-error.
- **Impacted areas**
  - Family metadata types, upgrade config content, UpgradeScene DOM composition, and overlay styling.
- **Risks / unknowns**
  - Too much copy can crowd mobile cards if not carefully styled.
  - Stronger identity language must still leave room for hybrid builds.

## Goals / Non-Goals

**Goals:**

- Clarify how each family wants the player to move/route.
- Clarify family and per-upgrade costs/tradeoffs.
- Improve consequence readability on upgrade cards in both supported locales.

**Non-Goals:**

- Full economy rebalance.
- Adding many new upgrades or new family taxonomy.

## Decisions

1. Extend family metadata with explicit tradeoff text.
- Decision: add a family tradeoff field so scene UI can communicate both identity and cost model.
- Why: reduces ambiguity between Control and Survival style messaging.
- Alternative considered: infer family tradeoffs from per-upgrade tradeoff text only. Rejected because it stays inconsistent across cards.

2. Keep deterministic draft behavior unchanged.
- Decision: retain current seeded draft helper and contrast-first family logic.
- Why: target is readability/identity clarity, not randomness behavior.
- Alternative considered: rewrite draft weighting for stronger family forcing. Rejected as unnecessary scope expansion.

3. Use explicit labels in card copy for scan speed.
- Decision: add concise labels (identity/playstyle/tradeoff) and tighten visual hierarchy.
- Why: improves glanceability on mobile without redesigning the full shell.
- Alternative considered: add new modal compare view. Rejected as out of scope.

## Risks / Trade-offs

- [Mobile text density increases] -> Use short labels and keep line-height compact.
- [Identity feels too rigid] -> Keep hybrid drafting and preserve per-upgrade nuance text.
- [Localization drift] -> Add parallel keys for both English and Catalan in the same pass.
