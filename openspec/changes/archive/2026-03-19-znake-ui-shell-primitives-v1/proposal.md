## Why

We already have a mobile-first split behavior, but shell rules are coupled to scene-specific class toggles.

For upcoming DOM-first menu migration, we need reusable shell primitives that can be shared by future menu components and flows.

## What Changes

- Introduce a dedicated UI shell stylesheet with reusable shell primitives.
- Add shell state API helpers to manage shell mode and split ratios.
- Keep current behavior equivalent by bridging existing `setSceneChrome` calls to the new primitive layer.

## Scope

- In scope: shell primitives, wiring, and compatibility refactor.
- Out of scope: full menu scene migration to DOM components.

## Impacted Specs

- `ui-foundation`
