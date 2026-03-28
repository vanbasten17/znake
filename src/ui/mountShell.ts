const SHELL_MARKUP = `
<div id="hud">
  <div id="hud-top">
    <div id="title-text">ZNAKE</div>
    <div id="stats-bar">
      <div class="stat stat-secondary" data-priority="secondary"><span class="stat-label" id="run-label">--</span><span class="stat-val" id="run-num">1</span></div>
      <div class="stat stat-primary" data-priority="primary"><span class="stat-label" id="score-label">--</span><span class="stat-val" id="score-disp">0</span></div>
      <div class="stat stat-primary" data-priority="primary"><span class="stat-label" id="floor-label">--</span><span class="stat-val" id="floor-disp">1</span></div>
      <div class="stat stat-secondary" data-priority="secondary"><span class="stat-label" id="kills-label">--</span><span class="stat-val" id="kills-disp">0</span></div>
    </div>
  </div>
  <div id="objective-status" aria-live="polite"></div>
  <div id="route-status"></div>
  <div id="run-status" aria-live="polite">...</div>
</div>
<div id="game-area">
  <div id="phaser-container"></div>
</div>
`

const LEGACY_OVERLAY_SELECTORS = [
  '#controls',
  '#hint-bar',
  '#tap-pad',
  '#touch-overlay',
  '#quadrant-overlay',
  '.touch-direction-overlay',
  '.quadrant-overlay',
]

const removeLegacyOverlays = (): void => {
  for (const selector of LEGACY_OVERLAY_SELECTORS) {
    for (const node of document.querySelectorAll(selector)) {
      node.remove()
    }
  }
}

export const mountShell = (): void => {
  removeLegacyOverlays()
  if (document.getElementById('hud')) {
    return
  }
  document.body.insertAdjacentHTML('afterbegin', SHELL_MARKUP)
}
