## Why

Manual transfer from Google Stitch designs to Phaser scene code is slow and error-prone, especially for spacing/alignment.

We need an internal developer tool to accelerate iteration and reduce visual drift.

## What Changes

- Add a dev-only mapper under `tools/` (not runtime `src/`) to transform Stitch screen data into Phaser-oriented layout output.
- Focus first on:
  - container/frame hierarchy
  - text blocks
  - rounded rectangle cards/borders
  - basic spacing constraints and auto-fit checks
- Output:
  - intermediate normalized JSON layout
  - suggested Phaser code snippet skeletons
  - overlap/fit diagnostics

## Scope

- In scope: CLI tool for development workflow, optional scripts in `package.json`.
- Out of scope: runtime game dependency, perfect full-fidelity export for all Stitch components.

## Impacted Specs

- `tooling`: new internal design-to-code mapping utility.
