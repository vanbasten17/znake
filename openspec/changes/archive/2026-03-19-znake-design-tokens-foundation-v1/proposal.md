## Why

Menu/UI redesign work is slowing down because visual values are spread across ad-hoc literals.

To prepare DOM-first menu migration, we need a reusable design-token foundation for color, typography, spacing, radius, glow, depth, and motion.

## What Changes

- Introduce shared CSS design tokens in a dedicated stylesheet.
- Wire the token layer into the app global styles.
- Replace core UI shell literals with token references, while preserving current visuals/behavior.

## Scope

- In scope: token foundation and initial adoption in current global UI stylesheet.
- Out of scope: full scene migration to DOM, full component library, or gameplay mechanics changes.

## Impacted Specs

- `ui-foundation` (new)
