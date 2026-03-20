## Why

Shield icon readability can be improved for quick recognition on mobile and small displays.

## What Changes

- Refine shield marker vector icon in `znake-markers` art pipeline:
  - remove inner cross,
  - orient crest as downward-pointing shield.
- Apply the same shield icon update for both canvas and Phaser render paths.
- Add a dev-only reference scenario (under `?dev=1`) that shows gameplay elements in one static board with hover labels for quick visual QA.
- Keep production gameplay mechanics unchanged.

## Impact

- Better visual clarity and consistency for defensive pickup recognition.
- Faster developer verification workflow for markers/items/hazards/enemy readability.
