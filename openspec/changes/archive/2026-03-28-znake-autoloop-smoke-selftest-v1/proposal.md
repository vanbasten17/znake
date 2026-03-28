## Why

Volem una prova de fum del pipeline autònom amb un canvi real però mínim, per confirmar que `autoloop` processa un change de principi a fi sense tocar gameplay.

## What Changes

- Add a tiny metadata field (`loopVersion`) to autoloop report output.
- Validate the full loop (`check -> smoke -> openspec validate`) over this self-test change.

## Key Points (Codex-style)

- **What is changing**
  - `autoloop` report output includes a static version marker for traceability.
- **Why we are doing it**
  - To verify the autonomous workflow on a low-risk, tooling-only code delta.
- **Impacted areas**
  - `tools/autoloop.mjs` and generated `.autoloop/loop-report.json` output contract.
- **Risks / unknowns**
  - None meaningful; this is non-gameplay metadata only.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `tooling`: extend autoloop report artifact contract with loop version metadata.

## Impact

- Affected code: `tools/autoloop.mjs`.
- Affected spec: `openspec/specs/tooling/spec.md` (delta in this change).
- No gameplay/simulation behavior changes.
