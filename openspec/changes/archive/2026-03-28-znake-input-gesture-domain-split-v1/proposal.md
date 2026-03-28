## Why

Input handling is currently a single file mixing gesture thresholds, DOM capture logic, and virtual-input writes. Splitting this improves maintainability and lets us tune touch forgiveness without touching scene logic.

## Key Points (Codex-style)

- What is changing
  - Extract touch gesture interpretation into a dedicated system module and shared constants.
  - Add an ambiguity guard for diagonal swipes so accidental turns are reduced.
- Why we are doing it
  - Improve modularity and reduce accidental input deaths on touch devices.
- Impacted areas
  - `systems/input.ts`, new `systems/input/*`, shared constants.
- Risks / unknowns
  - Over-filtering gestures could make controls feel unresponsive if thresholds are too strict.

## What Changes

- Separate capture and interpretation responsibilities.
- Keep deterministic simulation unchanged; only input event interpretation changes.
