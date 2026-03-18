## Why

Collision/death moments need clearer feedback so players instantly understand lethal impacts (enemy hit or wall/self crash), especially on mobile sessions.

## What Changes

- Add a dedicated `crash` feedback cue in the feedback system.
- Trigger `crash` cue when the player dies from enemy or wall/self collision.
- Keep existing `danger` cue behavior for non-collision hazard deaths (e.g. rift).

## Scope

- In scope: haptic + tone profile for lethal collision clarity.
- Out of scope: full audio system/music layer.

## Impacted Specs

- `gameplay`: collision/death feedback requirement is extended with explicit lethal collision cue.
