## Why

Three web-backed accessibility ideas (WCAG target size, reduced motion preference, non-color-only risk cueing) are high-impact and low-risk for player clarity.

## Key Points (Codex-style)

- What is changing
  - Add system reduced-motion support, minimum target-size token usage, and symbolic route-risk cueing.
- Why we are doing it
  - Improve readability, comfort, and fairness signaling across input modalities.
- Impacted areas
  - Accessibility system, shared UI CSS, route risk text formatting.
- Risks / unknowns
  - Over-signaling can make risk lines noisier.

## What Changes

- Respect `prefers-reduced-motion` at runtime.
- Add reusable target-size token and apply to interactive controls.
- Add shape/symbol risk marker in route risk text.
