# Znake Storefront + Web Launch Kit (v1)

## Purpose

Define the minimum professional launch-facing package for app-store submission and global web release, aligned with in-game identity and readability standards.

## Store Visual Asset Contract

### 1) App Icon

- Master source: `1024x1024` square PNG.
- Safe zone: keep core glyph/content inside center `80%` area.
- Visual language: must reuse Znake palette cues (neon accent + deep navy base) and maintain clean silhouette legibility at small sizes.
- Export set: `1024`, `512`, `256`, `192`, `128` PNG variants from same source.

### 2) Screenshots

- Minimum set: `6` screenshots.
- Required sequence:
1. Core run action (hazard pressure + readable HUD).
2. Upgrade decision screen (identity + tradeoff readability).
3. Reward/relic choice context.
4. Mid/high-pressure combat or hazard survival moment.
5. Death/summary loop readability.
6. Meta/progression/menu surface clarity.
- Overlay text policy: optional short callouts only; must not hide key gameplay information.

### 3) Feature Graphic

- Primary target: `1024x500` PNG.
- Composition: logo/title + one recognizable gameplay frame and clear focal contrast.
- Must avoid misleading montage effects that do not match in-game presentation.

### 4) Short Video Requirements

- Duration: `15-30` seconds.
- Required beats:
1. Immediate gameplay hook (first 3 seconds).
2. Controls readability.
3. Upgrade/reward decision moment.
4. High-pressure run state and concise outcome beat.
- Capture rule: no post-production effects that alter gameplay speed/clarity beyond title card fades.

## Web Launch Page Contract

Launch page MUST include:
- concise positioning statement (what game + why it is distinct),
- keyboard and touch controls explanation,
- privacy + support links,
- platform links (web play + available app stores),
- visible build version and release channel.

## Minimal Support Surface Contract

Launch-facing surfaces MUST expose:
- FAQ link,
- feedback path,
- contact path,
- privacy policy link,
- support landing link.

## Localization Scope (Launch Surfaces)

Required localized domains:
- store-facing short and long description copy,
- launch-page hero and controls copy,
- launch-page support/platform labels,
- privacy/support link labels.

Fallback rule:
- if a locale is unavailable, fallback to default locale (`en`) without placeholder leaks.

## QA Quick Checks

- all required links resolve and open correctly,
- support links are tap-safe on portrait mobile,
- launch page remains readable at `360x640` and desktop widths,
- displayed version/channel matches release metadata values.
