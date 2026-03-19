import Phaser from 'phaser'
import styles from '../../styles/relicDraftOverlay.module.css'
import { drawRelicDraft } from '../core/meta'
import { getFloorObjective } from '../core/objectives'
import { gameState } from '../core/state'
import type { RelicDefinition } from '../core/types'
import { getUpgradeHintText, setHintText, setSceneChrome } from '../systems/domHud'
import { t } from '../systems/i18n'
import { resetVirtualInput } from '../systems/input'
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

    this.choices = drawRelicDraft()
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

    const root = document.createElement('div')
    root.className = styles.overlay

    const title = document.createElement('h2')
    title.className = styles.title
    title.textContent = t('relic.selectTitle')
    root.append(title)

    const subtitle = document.createElement('p')
    subtitle.className = styles.subtitle
    subtitle.textContent = t('upgrade.chooseOne')
    root.append(subtitle)

    const objective = document.createElement('p')
    objective.className = styles.objective
    objective.textContent = t('menu.nextObjective', {
      objective: this.getObjectivePreview(gameState.floor),
    })
    root.append(objective)

    const cards = document.createElement('div')
    cards.className = styles.cards
    root.append(cards)

    for (const [index, relic] of this.choices.entries()) {
      cards.append(this.createRelicCard(relic, index))
    }

    gameArea.append(root)
    this.overlayRoot = root
  }

  private getObjectivePreview(floor: number): string {
    const objective = getFloorObjective(floor, gameState.runObjectiveOffset)
    if (objective.kind === 'boss') {
      return t('game.objectiveBossPreview')
    }
    if (objective.kind === 'score') {
      return t('game.objectiveScorePreview', { target: objective.scoreTarget })
    }
    if (objective.kind === 'kills') {
      return t('game.objectiveKillsPreview', { target: objective.killsTarget })
    }
    return t('game.objectivePortalPreview')
  }

  private createRelicCard(relic: RelicDefinition, index: number): HTMLButtonElement {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = styles.card
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
    gameState.selectedRelicId = relic.id
    trackRetentionEvent('relic_picked', {
      relicId: relic.id,
      run: gameState.run,
    })
    this.teardownOverlay()
    transitionToScene(this, 'Game', { chrome: 'run' })
  }
}
