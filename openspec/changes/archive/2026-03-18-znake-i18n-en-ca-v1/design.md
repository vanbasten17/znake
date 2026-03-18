## Context

Most strings are currently hardcoded in English. This blocks localization testing and increases future translation refactor cost.

## Goals / Non-Goals

**Goals:**
- Support English and Catalan now.
- Localize high-visibility product text and gameplay hints.
- Localize progression-critical labels (talents, relics, biome header).
- Keep implementation lightweight and incremental.
- Provide a simple manual language-switch option in the main menu.

**Non-Goals:**
- Full localization QA tooling.
- Full settings screen for localization management.

## Decisions

- Use `i18next` with `i18next-browser-languagedetector`.
- Keep translations in code resources for this phase.
- Expose a small `t()` helper and initialize i18n during app bootstrap.
- Localize static DOM labels and scene-created text.
- Add a menu-level language toggle control (pointer and keyboard shortcut).

## Risks / Trade-offs

- [Risk] Some low-priority strings may remain temporarily untranslated. -> Mitigation: cover all critical user-facing paths first.
- [Risk] Mixed language if translation keys are missed. -> Mitigation: keep scope explicit in tasks and validate manually.
