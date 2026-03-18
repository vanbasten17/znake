## 1. Event coverage

- [x] 1.1 Instrument `upgrade_picked` and `floor_reached` during upgrade transition.
- [x] 1.2 Instrument `death_reason` and `time_alive` on death path.
- [x] 1.3 Instrument `input_mode` on run start paths.

## 2. Data plumbing

- [x] 2.1 Pass death context from gameplay to death summary flow.
- [x] 2.2 Enrich `run_end` payload with death and survival context.

## 3. Validation

- [x] 3.1 Validate OpenSpec change.
- [x] 3.2 Run `biome`, `tsc --noEmit`, and `build`.
