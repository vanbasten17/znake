import Phaser from 'phaser'
import { HEIGHT, WIDTH } from './core/constants'
import { ArcadeEffectsPipeline } from './render/shaders'
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
    pipeline: [ArcadeEffectsPipeline as any],
    scene: [MenuScene, RelicDraftScene, GameScene, UpgradeScene, DeathScene],
    render: {
      antialias: false,
      pixelArt: true,
      /** Fewer sub-pixel samples on Images/Graphics; helps a bit on fill-heavy frames. */
      roundPixels: true,
      powerPreference: 'high-performance',
    },
    fps: {
      target: 60,
      smoothStep: true,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  })
