# asset-dry-run

Preview SVG assets without modifying production game assets.

## Overview

Use this skill when you want to see how an SVG will render before committing it to the production `assets/sprites/generated` folder. This ensures that assets follow the "Premium Squared Neon" style guide and maintain perfect pixel alignment.

## Workflow

1.  **Modify Source**: Edit or create an SVG in `assets/sprites/source/`.
2.  **Execute Dry-Run**:
    ```bash
    pnpm sprites:dry-run
    ```
3.  **Inspect Output**:
    - The tool renders all source SVGs to `assets/sprites/previews/`.
    - Use the `view_file` tool on the resulting `.png` file to perform a visual check.
4.  **Validate**:
    - Ensure the inner borders are sharp (no anti-aliasing on straight lines).
    - check that colors match the semantic palette in [ASSETS_CONCEPT_ART.md](../../../assets/sprites/ASSETS_CONCEPT_ART.md).
5.  **Commit**: If satisfied, run the production update:
    ```bash
    pnpm sprites:update
    ```

## Constraints
- **Format**: Master assets MUST be `.svg`.
- **Dimensions**: Output is fixed at 40x40 px by default.
- **Alignment**: Ensure the SVG `viewBox` is `0 0 20 20` for a 2x integer upscale.
