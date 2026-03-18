## 1. Balance source extraction

- [x] 1.1 Create a centralized balance module for run defaults, progression, spawn rates, and economy values.
- [x] 1.2 Provide helper API for derived floor settings used by gameplay runtime.

## 2. Runtime refactor

- [x] 2.1 Refactor `GameScene` to consume floor setup and probabilities from balance config instead of literals.
- [x] 2.2 Refactor reward and talent-cost logic in `meta.ts` to consume balance config values.

## 3. Validation

- [x] 3.1 Validate OpenSpec change artifacts.
- [x] 3.2 Run `biome`, `tsc --noEmit`, and production build checks.
