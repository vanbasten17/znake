import Phaser from 'phaser'
import { HEIGHT, WIDTH } from './core/constants'
import { DeathScene } from './scenes/DeathScene'
import { GameScene } from './scenes/GameScene'
import { MenuScene } from './scenes/MenuScene'
import { RelicDraftScene } from './scenes/RelicDraftScene'
import { UpgradeScene } from './scenes/UpgradeScene'

export const createGame = (): Phaser.Game =>
  new Phaser.Game({
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#020208',
    parent: 'phaser-container',
    scene: [MenuScene, RelicDraftScene, GameScene, UpgradeScene, DeathScene],
    render: {
      antialias: false,
      pixelArt: true,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  })
