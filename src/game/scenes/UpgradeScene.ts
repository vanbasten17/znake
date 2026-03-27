import Phaser from 'phaser'
import styles from '../../styles/upgradeOverlay.module.css'
import { getRoomObjective } from '../core/objectives'
import { gameState } from '../core/state'
import type { Upgrade } from '../core/types'
import { UPGRADE_FAMILIES, drawUpgradeDraft } from '../core/upgrades'
import { deriveRunSeed } from '../simulation/rng'
import { getMoveHintText, getUpgradeHintText, setHintText, setSceneChrome } from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { t } from '../systems/i18n'
import { resetVirtualInput } from '../systems/input'
import { transitionToScene } from '../systems/sceneFlow'
import { trackRetentionEvent } from '../systems/telemetry'

type UpgradeData = {
  score?: number
  floor?: number
}

export class UpgradeScene extends Phaser.Scene {
  private score = 0
  private floor = 1
  private picked = false
  private choices: Upgrade[] = []
  private overlayRoot: HTMLDivElement | null = null

  public constructor() {
    super('Upgrade')
  }

  public create(data: UpgradeData): void {
    setSceneChrome('run')
    resetVirtualInput()
    this.score = data.score ?? 0
    this.floor = data.floor ?? 1
    this.picked = false
    this.choices = []

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.teardownOverlay()
      this.input.keyboard?.removeAllListeners()
    })

    const runSeed =
      gameState.currentRunSeed ??
      deriveRunSeed([Date.now(), gameState.run, gameState.floor, this.score])
    gameState.currentRunSeed = runSeed
    this.choices = drawUpgradeDraft({
      runSeed,
      floor: gameState.floor,
      ownedUpgradeIds: gameState.persistentUpgrades.map((upgrade) => upgrade.id),
      count: 3,
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

  private getUpgradeName(upgrade: Upgrade): string {
    return t(`upgrade.${upgrade.id}_name`, { defaultValue: upgrade.name })
  }

  private getUpgradeDescription(upgrade: Upgrade): string {
    return t(`upgrade.${upgrade.id}_desc`, { defaultValue: upgrade.desc })
  }

  private getUpgradeFamilyLabel(upgrade: Upgrade): string {
    return t(`upgrade.family.${upgrade.family}.label`, {
      defaultValue: UPGRADE_FAMILIES[upgrade.family].label,
    })
  }

  private getUpgradeFamilySummary(upgrade: Upgrade): string {
    return t(`upgrade.family.${upgrade.family}.summary`, {
      defaultValue: UPGRADE_FAMILIES[upgrade.family].summary,
    })
  }

  private getUpgradeFamilyTradeoff(upgrade: Upgrade): string {
    return t(`upgrade.family.${upgrade.family}.tradeoff`, {
      defaultValue: UPGRADE_FAMILIES[upgrade.family].tradeoff,
    })
  }

  private getUpgradeGameplay(upgrade: Upgrade): string {
    return t(`upgrade.${upgrade.id}_gameplay`, { defaultValue: upgrade.gameplay })
  }

  private getUpgradeTradeoff(upgrade: Upgrade): string {
    return t(`upgrade.${upgrade.id}_tradeoff`, { defaultValue: upgrade.tradeoff })
  }

  private pick(upgrade: Upgrade | undefined): void {
    if (this.picked || !upgrade) {
      return
    }
    this.picked = true
    emitFeedback('confirm')
    trackRetentionEvent('upgrade_picked', {
      upgradeId: upgrade.id,
      floor: gameState.floor,
      score: this.score,
    })
    gameState.persistentUpgrades.push(upgrade)
    gameState.floor += 1
    trackRetentionEvent('floor_reached', {
      floor: gameState.floor,
      score: this.score,
      kills: gameState.kills,
    })
    this.teardownOverlay()
    setHintText(getMoveHintText())
    transitionToScene(this, 'Game', { chrome: 'run', data: { score: this.score } })
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
    title.textContent = t('upgrade.floorCleared')
    root.append(title)

    const subtitle = document.createElement('p')
    subtitle.className = styles.subtitle
    subtitle.textContent = t('upgrade.chooseOne')
    root.append(subtitle)

    const objective = document.createElement('p')
    objective.className = styles.objective
    objective.textContent = t('menu.nextObjective', {
      objective: this.getObjectivePreview(this.floor + 1),
    })
    root.append(objective)

    const cards = document.createElement('div')
    cards.className = styles.cards
    root.append(cards)

    for (const [index, upgrade] of this.choices.entries()) {
      cards.append(this.createUpgradeCard(upgrade, index))
    }

    const footer = document.createElement('p')
    footer.className = styles.footer
    footer.textContent = t('upgrade.scoreFloor', { score: this.score, floor: this.floor })
    root.append(footer)

    gameArea.append(root)
    this.overlayRoot = root
  }

  private createUpgradeCard(upgrade: Upgrade, index: number): HTMLButtonElement {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = styles.card
    button.addEventListener('click', () => this.pick(upgrade))

    const icon = document.createElement('span')
    icon.className = styles.index
    icon.textContent = upgrade.icon
    button.append(icon)

    const content = document.createElement('span')
    content.className = styles.content
    button.append(content)

    const family = document.createElement('span')
    family.className = styles.family
    family.textContent = this.getUpgradeFamilyLabel(upgrade)
    family.style.color = `#${UPGRADE_FAMILIES[upgrade.family].color.toString(16).padStart(6, '0')}`
    content.append(family)

    const identity = document.createElement('span')
    identity.className = styles.identity
    identity.textContent = `${t('upgrade.identityLabel')}: ${this.getUpgradeFamilySummary(upgrade)}`
    content.append(identity)

    const name = document.createElement('span')
    name.className = styles.name
    name.textContent = this.getUpgradeName(upgrade)
    name.style.color = `#${upgrade.color.toString(16).padStart(6, '0')}`
    content.append(name)

    const description = document.createElement('span')
    description.className = styles.description
    description.textContent = this.getUpgradeDescription(upgrade)
    content.append(description)

    const gameplay = document.createElement('span')
    gameplay.className = styles.gameplay
    gameplay.textContent = `${t('upgrade.playstyleLabel')}: ${this.getUpgradeGameplay(upgrade)}`
    content.append(gameplay)

    const tradeoff = document.createElement('span')
    tradeoff.className = styles.tradeoff
    tradeoff.textContent = `${t('upgrade.tradeoffLabel')}: ${this.getUpgradeTradeoff(upgrade)}`
    content.append(tradeoff)

    const familyTradeoff = document.createElement('span')
    familyTradeoff.className = styles.familyTradeoff
    familyTradeoff.textContent = this.getUpgradeFamilyTradeoff(upgrade)
    familyTradeoff.style.borderLeftColor = `#${UPGRADE_FAMILIES[upgrade.family].color.toString(16).padStart(6, '0')}`
    content.append(familyTradeoff)

    const hotkey = document.createElement('span')
    hotkey.className = styles.hotkey
    hotkey.textContent = String(index + 1)
    button.append(hotkey)

    return button
  }

  private getObjectivePreview(floor: number): string {
    const objective = getRoomObjective(floor, gameState.runObjectiveOffset)
    if (objective.kind === 'collect_cores') {
      return t('game.roomObjectiveCollectCoresPreview', { target: objective.target })
    }
    if (objective.kind === 'defeat_elite') {
      return t('game.roomObjectiveDefeatElitePreview', { target: objective.target })
    }
    if (objective.kind === 'activate_terminals') {
      return t('game.roomObjectiveActivateTerminalsPreview', { target: objective.target })
    }
    return t('game.roomObjectiveSurvivePreview', {
      seconds: Math.ceil(objective.target / 1000),
    })
  }

  private teardownOverlay(): void {
    if (this.overlayRoot) {
      this.overlayRoot.remove()
      this.overlayRoot = null
    }
  }
}
