import i18next from 'i18next'

export const applyStaticDomTranslations = (): void => {
  const map: Array<{ id: string; key: string }> = [
    { id: 'run-label', key: 'hud.run' },
    { id: 'score-label', key: 'hud.score' },
    { id: 'floor-label', key: 'hud.floor' },
    { id: 'kills-label', key: 'hud.kills' },
    { id: 'pause-text', key: 'controls.pause' },
    { id: 'start-text', key: 'controls.start' },
  ]
  for (const { id, key } of map) {
    const node = document.getElementById(id)
    if (node) {
      node.textContent = i18next.t(key)
    }
  }

  document.title = i18next.t('app.title')
  document.documentElement.lang = i18next.resolvedLanguage ?? 'en'
  document.getElementById('btn-up')?.setAttribute('aria-label', i18next.t('controls.moveUp'))
  document.getElementById('btn-down')?.setAttribute('aria-label', i18next.t('controls.moveDown'))
  document.getElementById('btn-left')?.setAttribute('aria-label', i18next.t('controls.moveLeft'))
  document.getElementById('btn-right')?.setAttribute('aria-label', i18next.t('controls.moveRight'))
  document.getElementById('btn-pause')?.setAttribute('aria-label', i18next.t('controls.pauseGame'))
  document.getElementById('btn-start')?.setAttribute('aria-label', i18next.t('controls.startGame'))
}
