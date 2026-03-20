## Why

Marker entities currently render extra circular ring overlays that add visual noise and compete with the sprite silhouette.

## What Changes

- Remove ring/stroke overlays around core gameplay markers in `GameScene` render pass.
- Keep soft glow underlays where useful for readability.
- Preserve gameplay behavior, collisions, and spawn logic.

## Impact

- Cleaner marker presentation.
- Better sprite readability and less UI clutter during play.
