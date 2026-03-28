## 1. Spec Alignment

- [x] 1.1 Add challenge share-code contract requirements in `challenge-presets` spec deltas.
- [x] 1.2 Add challenge-share telemetry lifecycle requirements in `observability` spec deltas.

## 2. Apply Implementation

- [x] 2.1 Harden share-code parser for case-insensitive prefix normalization while preserving checksum/payload strictness.
- [x] 2.2 Add deterministic tests for round-trip success, checksum rejection, invalid payload rejection, and normalization defaults.

## 3. Validation

- [x] 3.1 Run `pnpm check`.
