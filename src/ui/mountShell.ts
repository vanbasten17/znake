const SHELL_MARKUP = `
<div id="hud">
  <div id="hud-top">
    <div id="title-text">ZNAKE</div>
    <div id="stats-bar">
      <div class="stat"><span class="stat-label" id="run-label">--</span><span class="stat-val" id="run-num">1</span></div>
      <div class="stat"><span class="stat-label" id="score-label">--</span><span class="stat-val" id="score-disp">0</span></div>
      <div class="stat"><span class="stat-label" id="floor-label">--</span><span class="stat-val" id="floor-disp">1</span></div>
      <div class="stat"><span class="stat-label" id="kills-label">--</span><span class="stat-val" id="kills-disp">0</span></div>
    </div>
  </div>
  <div id="run-status">...</div>
</div>
<div id="game-area">
  <div id="phaser-container"></div>
</div>
`

export const mountShell = (): void => {
  if (document.getElementById('hud')) {
    return
  }
  document.body.insertAdjacentHTML('afterbegin', SHELL_MARKUP)
}
