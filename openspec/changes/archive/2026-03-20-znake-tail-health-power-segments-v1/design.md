## Design

### Scope

- Apply segment damage only on enemy collisions.
- Preserve existing deterministic wall/self death behavior.
- Preserve shield precedence.

### Collision Resolution

1. Detect collision hit-part:
   - `head` hit => damage 2 segments
   - `body` hit => damage 1 segment
2. If shield exists:
   - consume shield and skip segment loss (existing behavior)
3. Otherwise:
   - remove N tail segments
   - if no removable segment remains, run ends

### Non-goals in this slice

- Reworking wall/self lethality.
- Full per-enemy damage tables.
- Persistent health UI; tail remains the visible health proxy.
