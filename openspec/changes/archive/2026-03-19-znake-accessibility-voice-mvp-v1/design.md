## Context

Current UX is optimized for style and pacing, but we need an explicit accessibility layer that can be toggled without changing gameplay rules.

The MVP must be stable, optional, and easy to disable.

## Goals / Non-Goals

**Goals:**

- Introduce persistent accessibility settings with immediate visual impact.
- Support basic voice command input using browser-native APIs.
- Reuse existing virtual input path to avoid gameplay logic divergence.
- Keep existing controls and progression behavior unchanged.

**Non-Goals:**

- Full screen-reader optimization pass.
- Full localization of speech recognition grammar across many locales.
- Remapping every UI interaction to voice in this iteration.
- Deep gameplay rebalance.

## Decisions

1. Add an accessibility settings model persisted in localStorage.
- Independent from run state.
- Applied during app init and refreshed on toggle.

2. Use CSS class/preset strategy for visual accessibility.
- `a11y-high-contrast`, `a11y-large-text`, `a11y-reduced-effects`.
- Keep token-driven styling and avoid ad-hoc per-scene overrides.
- Dark-launch these visual toggles for now (not user-facing in menu), while keeping code path ready.

3. Voice commands feed existing `virtualInput`.
- Commands map to `window.virtualInput.dir/start/pause`.
- Keyboard/touch remain first-class.

4. Graceful fallback for unsupported speech API.
- If unavailable or blocked, voice toggle remains visible but disabled/with clear status copy.

## Risks / Trade-offs

- [Risk] Speech recognition browser support is inconsistent.
  - Mitigation: capability detection + no-op fallback + clear localized status text.

- [Risk] High-contrast theme may diverge from visual identity.
  - Mitigation: derive from existing token palette; limit MVP to contrast delta, not full redesign.

- [Risk] Reduced effects may change “feel”.
  - Mitigation: only disable secondary FX (shake/flash intensity/glow), keep gameplay feedback intact.
