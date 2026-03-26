## Why

The current death summary tells the player that the run is over, but it does not quickly answer the two questions that matter most at defeat: what actually ended the run, and what kind of build they were shaping. Adding a concise recap now supports fairness, readability, and retention without redesigning the whole death scene or introducing analytics-heavy tracking.

## Key Points (Codex-style)

### What is changing

- Add a concise death recap that surfaces the run-ending cause, the player's build-family leaning, and a small set of notable run choices.
- Tighten the responsive copy contract so the recap stays readable on desktop and mobile.
- Reuse existing run state and telemetry-aligned data instead of creating duplicate tracking systems for recap content.

### Why we are doing it

- Help players understand whether a loss felt deserved and learn faster from the result.
- Reinforce run identity so upgrade choices feel meaningful even when a run ends early.
- Improve post-run clarity with low implementation risk and without a full death-scene redesign.

### Impacted areas

- Death scene recap content and responsive DOM presentation.
- Run-end summary/state assembly and localization-ready copy.
- Run lifecycle observability fields that already describe death and choice context.

### Risks / unknowns

- Existing run state may not yet expose every notable choice cleanly enough for recap ranking.
- Over-explaining the run end could make the overlay noisy on narrow screens.
- Build-family leaning needs to feel informative without implying a precise score breakdown the player cannot verify.

## What Changes

- Add a player-facing death recap contract that summarizes:
  - the most relevant death reason in plain language
  - the strongest upgrade-family leaning for the run
  - a concise list of notable run choices or defining picks
- Extend death-summary presentation requirements so the recap remains compact, scannable, and readable on portrait mobile and desktop layouts.
- Define observability/state expectations so run-end recap content is derived from existing run context where possible, including death reason and selected-upgrade identity metadata.
- Define HUD/DOM overlay responsiveness requirements for concise recap text wrapping and stacking behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `scenes`: Death scene requirements expand to include a concise recap for death cause, build identity, and notable choices with responsive readability expectations.
- `observability`: Run lifecycle telemetry requirements expand so run-end recap content is aligned with existing death and build-context data instead of duplicate instrumentation.
- `input-hud`: DOM HUD requirements expand to cover responsive run-end recap readability on narrow and wide layouts.

## Impact

- Affected systems: `DeathScene`, DOM overlay composition/styling, run summary assembly, localization copy, and telemetry/run-state adapters.
- Affected contracts: run-end payload shape used by death summary, upgrade-family metadata consumption, and responsive text hierarchy rules for post-run overlays.
- Dependencies: no new runtime dependency; this change leans on existing upgrade identity metadata and current run-end observability/state flows.
