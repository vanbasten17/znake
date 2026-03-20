## 1. Spec

- [x] 1.1 Add gameplay requirements for shape semantics, entity classification, priority feedback, and state-driven visuals.
- [x] 1.2 Add UI foundation requirements for color semantics and readability hierarchy constraints.
- [x] 1.3 Add extensibility requirement for data-driven entity-to-visual-token mapping.

## 2. Validation

- [x] 2.1 Run `openspec validate znake-visual-language-system-v1`.

## 3. Apply (implementation slice)

- [x] 3.1 Add `visualLanguage` data model for marker-tone semantic tokens (category, intent, priority, shape, color family, state emphasis).
- [x] 3.2 Wire marker semantic roles to the central visual language mapping.
- [x] 3.3 Add internal checker command for mapping coverage and ambiguity guardrails.
- [x] 3.4 Run `pnpm validate:visual-language`.
- [x] 3.5 Run `pnpm check`.
- [x] 3.6 Run `pnpm build`.
- [x] 3.7 Tune collectible emphasis by removing persistent food-core glow underlay in gameplay render.
- [x] 3.8 Enforce no-persistent-glow rule for score-linked markers via visual-language mapping (`allowGlow=false`).
- [x] 3.9 In dev reference board, render glow preview only for tones with `allowGlow=true`.
