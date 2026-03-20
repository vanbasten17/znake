## 1. Spec

- [x] 1.1 Add tooling spec delta for SVG-to-PNG converter workflow.

## 2. Implementation

- [x] 2.1 Add converter tool and npm script.
- [x] 2.2 Add concise usage docs with pipeline-aligned replacement steps.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-svg-marker-converter-v1`.
- [x] 3.2 Run `pnpm sprites:svg2png -- --in assets/sprites/source --out /tmp/znake-svg2png-smoke --size 40`.
- [x] 3.3 Run `pnpm check`.
