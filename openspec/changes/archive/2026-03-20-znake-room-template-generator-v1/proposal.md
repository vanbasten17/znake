## Why

Current floor geometry is purely segment-wall scatter. A room-and-corridor template increases navigation identity and supports future biome expansion while preserving current flow.

## What Changes

- Add configurable floor template selection (`classic` | `rooms_v1`) in centralized balance.
- Implement connected room generation with corridor carving and connectivity validation.
- Add zone metadata (`room` / `corridor`) and zone-aware spawn choices for food, enemies, and obstacle placement.
- Add safe fallback to classic generation after bounded failed attempts.
- Optionally emit telemetry for resolved floor template.

## Impact

- Affected specs:
  - `gameplay`
  - `balance-config`
  - `observability`
- Affected runtime:
  - `GameScene` floor generation and spawn pipelines
  - `BALANCE` floor-template tuning
  - Retention event payload with template context
