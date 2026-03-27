## Why

Znake currently treats biomes mainly as presentation flavor, while `NEXT_STEPS.md` identifies biome-level gameplay rules as a high-impact lever for run identity and routing mastery. We need a deterministic, data-driven biome rules contract now so each biome changes movement, route planning, and survival pressure without breaking fairness or existing progression systems.

## Key Points (Codex-style)

- **What is changing**
  - We define a generalized multi-biome gameplay-rules model: deterministic biome activation, rule taxonomy, first-pass gameplay modifiers, compatibility guardrails, readability requirements, and telemetry.
- **Why we are doing it**
  - We want biome transitions to create meaningful strategic shifts, so players adapt pathing and risk decisions instead of experiencing biome changes as visual-only swaps.
- **Impacted areas**
  - Gameplay rule contracts, centralized balance configuration, run-map/segment activation metadata, GameScene readability surfaces, and observability payloads.
- **Risks / unknowns**
  - Over-stacking pressure modifiers can reduce fairness; underpowered modifiers can feel cosmetic. Guardrail thresholds and first-pass modifier count must preserve clarity and iteration speed.

## What Changes

- Define a biome gameplay-rule taxonomy with deterministic activation contracts tied to run seed, run-map context, and segment entry.
- Define first-pass biome gameplay modifiers that specifically alter movement/routing/survival decisions and pressure rhythm, not only visuals.
- Define compatibility and guardrail contracts with objective flow, mutator composition, and body-economy systems to prevent low-agency or exploit-prone states.
- Define scene readability requirements for active biome-rule visibility and concise in-run explanation of tactical impact.
- Define telemetry contracts for biome-rule activation, guardrail interventions, and outcome impact analysis.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `gameplay`: Add deterministic biome-rule activation, modifier effect contracts, and guardrail interactions with objectives/mutators/body economy.
- `balance-config`: Add centralized biome-rule taxonomy, tuning tables, compatibility matrices, and guardrail thresholds.
- `scenes`: Add active-biome-rule readability and HUD/overlay presentation contracts for in-run decision clarity.
- `observability`: Add stable telemetry for biome activation lifecycle, guardrail rejections/interventions, and run-end biome impact context.
- `run-map`: Add deterministic biome assignment and progression metadata contracts that drive biome-rule activation context.

## Impact

- Affected systems:
  - Deterministic simulation and progression hooks for biome rule activation.
  - Central balance data for biome modifier parameters and compatibility policies.
  - Run-map node/segment metadata used to signal biome context.
  - GameScene HUD/overlay surfaces for active rule readability.
  - Telemetry schema/events for balancing and fairness diagnostics.
- No major progression-system refactor is in scope.
- No large multi-biome content drop is in scope; this is a first-pass systems contract for iterative expansion.
