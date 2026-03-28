## Why

Core gameplay identifiers are repeated as string literals across systems, making refactors brittle and increasing typo risk.

## Key Points (Codex-style)

- What is changing
  - Add a centralized shared ID registry for frequently reused gameplay identifiers.
  - Replace local magic string literals in selected systems with registry constants.
- Why we are doing it
  - Improve consistency, readability, and extensibility for future enemy/upgrade/content additions.
- Impacted areas
  - Shared constants/types and gameplay modules that compare ID strings.
- Risks / unknowns
  - Partial migration could leave mixed conventions if not applied consistently.

## What Changes

- Introduce shared `as const` tuples for gameplay IDs.
- Keep runtime behavior unchanged.
