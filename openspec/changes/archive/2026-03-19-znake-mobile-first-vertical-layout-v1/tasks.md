## 1. Spec + layout contract

- [x] 1.1 Add OpenSpec deltas for portrait-first mobile shell and run-scene 2/3 + 1/3 split.

## 2. Runtime layout implementation

- [x] 2.1 Update core canvas dimensions to portrait-friendly ratio.
- [x] 2.2 Implement run-scene shell split (gameplay 2fr / controls 1fr) on touch/no-keyboard contexts.
- [x] 2.3 Preserve keyboard/large-screen behavior with hidden touch controls.

## 3. Scene composition polish

- [x] 3.1 Re-tune menu spacing to avoid overlap on portrait-first canvas.
- [x] 3.2 Re-tune relic/upgrade card anchors for taller vertical composition.

## 4. Validation

- [x] 4.1 Validate OpenSpec change.
- [x] 4.2 Run `pnpm check`.
- [x] 4.3 Run `pnpm build`.
