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
<div id="controls">
  <div id="dpad">
    <button class="dpad-btn" id="btn-up" data-dir="up">
      <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" stroke-width="2.5"><polyline points="18 15 12 9 6 15" /></svg>
    </button>
    <button class="dpad-btn" id="btn-down" data-dir="down">
      <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" stroke-width="2.5"><polyline points="6 9 12 15 18 9" /></svg>
    </button>
    <button class="dpad-btn" id="btn-left" data-dir="left">
      <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" stroke-width="2.5"><polyline points="15 18 9 12 15 6" /></svg>
    </button>
    <button class="dpad-btn" id="btn-right" data-dir="right">
      <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" stroke-width="2.5"><polyline points="9 18 15 12 9 6" /></svg>
    </button>
    <div id="dpad-center"></div>
  </div>

  <div id="right-controls">
    <button class="action-btn" id="btn-pause">
      <span class="btn-icon">II</span>
      <span id="pause-text">...</span>
    </button>
    <button class="action-btn" id="btn-start">
      <span class="btn-icon">></span>
      <span id="start-text">...</span>
    </button>
  </div>
</div>
<div id="hint-bar">...</div>
`

export const mountShell = (): void => {
  if (document.getElementById('hud')) {
    return
  }
  document.body.insertAdjacentHTML('afterbegin', SHELL_MARKUP)
}
