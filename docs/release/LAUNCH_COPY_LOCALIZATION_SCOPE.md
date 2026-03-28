# Launch Copy Localization Scope

## Objective

Define copy domains and locale obligations for store and web launch surfaces only.

## In Scope

- Store-facing metadata (short description, long description, promotional text).
- Web launch page content (positioning, controls summary, support/platform labels).
- Link labels for privacy/support/FAQ/feedback/contact.

## Out of Scope

- Full gameplay copy localization expansion.
- New locale coverage for in-run HUD/system messages beyond existing baseline.

## Required Locale Set (v1)

- `en` (default fallback)
- `ca`

## Optional Expansion Candidates (post-v1)

- `es`
- `pt-BR`
- `fr`
- `de`
- `ja`

## Fallback Behavior

- Unsupported locale requests MUST resolve to `en`.
- Missing key in supported locale MUST fallback to `en` key-level value.
- If no fallback key exists, release is blocked until the key is supplied.

## Copy Ownership

- Product/design owns positioning and clarity checks.
- Engineering owns key wiring and fallback integrity.
- Release owner signs off final locale completeness before submission.
