## Context

The UI shell and menu overlays already match the target visual direction, but readability quality is constrained by:

- low-contrast secondary labels in key areas
- compact text blocks with minimal line-height
- inconsistent emphasis between title/body/status text

Because these screens are now DOM/CSS-driven, readability is best improved through token and module-level style adjustments.

## Goals / Non-Goals

**Goals:**

- Increase legibility of stats, card copy, goals, and action labels.
- Keep visual style consistent with current neon-grid identity.
- Preserve all interaction and progression behavior.

**Non-Goals:**

- Reworking screen layout architecture.
- Introducing new UI components or flows.
- Modifying gameplay rendering or balance.

## Decisions

1. Refine text hierarchy through shared tokens.
- Add explicit text-primary/secondary/tertiary values and text-shadow utility token.

Alternatives considered:
- Per-module ad-hoc color tweaks only; rejected due to style drift risk.

2. Improve readability using CSS-level typographic tuning.
- Increase line-height and modestly increase font sizes in dense copy sections.
- Reduce low-contrast colors where they harm readability.

Alternatives considered:
- Changing font families; rejected for now to keep brand continuity.

3. Keep behavior untouched.
- Only CSS and token edits, no scene logic changes.

Alternatives considered:
- Content-level copy shortening; deferred to future UX iteration.

## Risks / Trade-offs

- [Risk] Over-bright text can flatten visual hierarchy.
  - Mitigation: maintain differentiated primary/secondary/tertiary token levels.
- [Risk] Slightly larger text may pressure vertical space on short screens.
  - Mitigation: use clamp values and keep only modest increases.
