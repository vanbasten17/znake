## Context

Run-end telemetry and recap already provide detailed context, but that context is transient from a player perspective. A persistent, bounded timeline in menu can surface immediate learning cues while preserving current architecture boundaries (simulation logic remains untouched; scenes orchestrate persistence/presentation only).

## Key Points (Codex-style)

- What is changing
  - Add run-history storage helper and menu timeline rendering.
- Why we are doing it
  - Turn existing run-end context into actionable player feedback between runs.
- Impacted areas
  - Core local storage helper, death/menu scene orchestration, menu CSS.
- Risks / unknowns
  - Overly verbose rows can hurt readability; cap entries and keep concise fields.

## Goals / Non-Goals

**Goals:**
- Persist last N run snapshots safely in local storage.
- Render compact recent-run timeline in menu.
- Keep deterministic ordering and bounded payload shape.

**Non-Goals:**
- Cloud sync or cross-device history.
- Full replay browser.
- Deep filtering/search UI.

## Decisions

### Decision: Use bounded local storage ring behavior
- Keep max history at six entries and display top three in menu.
- Rationale: enough context for learning without visual clutter.

### Decision: Persist only summary fields
- Store seed, floor, score, death reason, build leaning, preset id, timestamp.
- Rationale: keeps payload small and presentation-focused.

### Decision: Keep timeline in menu overlay only
- No gameplay HUD integration in this slice.
- Rationale: maintain low-overlap, low-risk implementation.

## Risks / Trade-offs

- [Risk] Storage corruption/malformed payloads can break rendering. -> Mitigation: strict normalization + best-effort fallback to empty list.
- [Risk] Mobile readability pressure from long rows. -> Mitigation: compact typography and fixed max displayed rows.

## Migration Plan

1. Add `runHistory` storage key and helper module.
2. Append run history entry at death run-end.
3. Render recent rows in menu overlay with compact styles.
4. Validate via `pnpm check`, `pnpm smoke`, strict OpenSpec validation, and `pnpm build`.

Rollback strategy:
- Remove helper integration points and keep recap/telemetry unchanged.

## Open Questions

- Should a future iteration add quick-filter chips (standard/daily/weekly) for the timeline?
- Should selecting a history entry offer one-click restart with same seed in a later change?
