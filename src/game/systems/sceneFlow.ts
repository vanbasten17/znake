import type Phaser from 'phaser'
import type { UiShellMode } from './domHud'
import { setSceneChrome } from './domHud'
import { resetVirtualInput } from './input'

type TransitionOptions = {
  data?: object
  chrome?: UiShellMode
}

export const transitionToScene = (
  scene: Phaser.Scene,
  key: string,
  options?: TransitionOptions,
): void => {
  resetVirtualInput()
  if (options?.chrome) {
    setSceneChrome(options.chrome)
  }
  scene.scene.start(key, options?.data)
}
