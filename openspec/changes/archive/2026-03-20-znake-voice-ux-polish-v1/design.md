## Design

### Goals

- Improve player confidence in voice command handling without altering movement logic.
- Keep latency and performance impact negligible.

### Approach

1. Introduce a lightweight voice UX state in `voiceInput`:
   - runtime status: `off`, `listening`, `unsupported`, `denied`
   - last command feedback: accepted/rejected (+ short-lived)
2. Publish voice UX updates through a tiny subscription mechanism used by `MenuScene`.
3. Reuse existing hint bar for run-time feedback pulse (`VOICE: UP`, `VOICE NOT RECOGNIZED`) with auto-clear.
4. Keep command mapping and fallback input pipeline unchanged.

### Data/Interface Changes

- Add exported types:
  - `VoiceRuntimeStatus`
  - `VoiceCommandOutcome`
  - `VoiceUxSnapshot`
- Add exported functions:
  - `getVoiceUxSnapshot()`
  - `subscribeVoiceUx(listener)`
- No persistent schema changes.

### Risks and Mitigations

- Risk: noisy UI from frequent speech interim results.
  - Mitigation: emit rejection feedback only when transcript is non-empty and command parse fails after debounce.
- Risk: stale status in menu.
  - Mitigation: scene subscribes on create and unsubscribes on shutdown.
