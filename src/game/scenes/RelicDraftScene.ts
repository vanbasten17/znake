import Phaser from 'phaser'
import styles from '../../styles/relicDraftOverlay.module.css'
import { drawRelicDraft } from '../core/meta'
import { gameState } from '../core/state'
import type { RelicDefinition } from '../core/types'
import { createSeededRng, deriveRunSeed } from '../simulation/rng'
import { createButton, createEl } from '../systems/domFactory'
import { getUpgradeHintText, setHintText, setSceneChrome } from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { t } from '../systems/i18n'
import { resetVirtualInput } from '../systems/input'
import { getObjectivePreviewText } from '../systems/objectivePresenter'
import { transitionToScene } from '../systems/sceneFlow'
import { trackRetentionEvent } from '../systems/telemetry'

export class RelicDraftScene extends Phaser.Scene {
  private choices: RelicDefinition[] = []
  private picked = false
  private overlayRoot: HTMLDivElement | null = null

  public constructor() {
    super('RelicDraft')
  }

  public create(): void {
    setSceneChrome('run')
    resetVirtualInput()
    this.picked = false
    this.choices = []
    this.input.keyboard?.removeAllListeners()
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.teardownOverlay()
      this.input.keyboard?.removeAllListeners()
    })

    const runSeed =
      gameState.currentRunSeed ??
      deriveRunSeed([Date.now(), gameState.run, gameState.floor, gameState.totalScore])
    gameState.currentRunSeed = runSeed
    const draftRng = createSeededRng(deriveRunSeed([runSeed, 0x52454c49]))
    this.choices = drawRelicDraft({
      nextIndex: (poolLength) => draftRng.nextInt(0, Math.max(0, poolLength - 1)),
    })
    this.mountOverlay()

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Digit1' || event.code === 'Numpad1') {
        this.pick(this.choices[0])
      }
      if (event.code === 'Digit2' || event.code === 'Numpad2') {
        this.pick(this.choices[1])
      }
      if (event.code === 'Digit3' || event.code === 'Numpad3') {
        this.pick(this.choices[2])
      }
    })

    setHintText(getUpgradeHintText())
  }

  private mountOverlay(): void {
    this.teardownOverlay()

    const gameArea = document.getElementById('game-area')
    if (!gameArea) {
      return
    }

    const root = createEl('div', styles.overlay)

    const title = createEl('h2', styles.title, t('relic.selectTitle'))
    root.append(title)

    const subtitle = createEl('p', styles.subtitle, t('upgrade.chooseOne'))
    root.append(subtitle)

    const objective = createEl('p', styles.objective)
    objective.textContent = t('menu.nextObjective', {
      objective: getObjectivePreviewText(gameState.floor, gameState.runObjectiveOffset),
    })
    root.append(objective)

    const cards = createEl('div', styles.cards)
    root.append(cards)

    for (const [index, relic] of this.choices.entries()) {
      cards.append(this.createRelicCard(relic, index))
    }

    gameArea.append(root)
    this.overlayRoot = root
  }

  private createRelicCard(relic: RelicDefinition, index: number): HTMLButtonElement {
    const button = createButton(styles.card, '')
    button.addEventListener('click', () => this.pick(relic))

    const indexLabel = document.createElement('span')
    indexLabel.className = styles.index
    indexLabel.textContent = String(index + 1)
    button.append(indexLabel)

    const content = document.createElement('span')
    content.className = styles.content
    button.append(content)

    const name = document.createElement('span')
    name.className = styles.name
    name.textContent = t(`relic.${relic.id}_name`, { defaultValue: relic.name })
    content.append(name)

    const description = document.createElement('span')
    description.className = styles.description
    description.textContent = t(`relic.${relic.id}_description`, {
      defaultValue: relic.description,
    })
    content.append(description)

    return button
  }

  private teardownOverlay(): void {
    if (this.overlayRoot) {
      this.overlayRoot.remove()
      this.overlayRoot = null
    }
  }

  private pick(relic: RelicDefinition | undefined): void {
    if (!relic || this.picked) {
      return
    }
    this.picked = true
    emitFeedback('confirm')
    gameState.selectedRelicId = relic.id
    trackRetentionEvent('relic_picked', {
      relicId: relic.id,
      run: gameState.run,
    })
    this.teardownOverlay()
    transitionToScene(this, 'Game', { chrome: 'run' })
  }
}
