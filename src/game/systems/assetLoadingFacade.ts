import type Phaser from 'phaser'
import { registerMarkerHiResTextures } from '../render/markerHiRes'

export type SceneAssetLoadingFacade = {
  ensureMarkerTextures: (scene: Phaser.Scene) => Promise<void>
}

const defaultSceneAssetLoadingFacade: SceneAssetLoadingFacade = {
  ensureMarkerTextures: async (scene) => {
    await registerMarkerHiResTextures(scene)
  },
}

export const loadCoreSceneAssets = async (
  scene: Phaser.Scene,
  facade: SceneAssetLoadingFacade = defaultSceneAssetLoadingFacade,
): Promise<void> => {
  await facade.ensureMarkerTextures(scene)
}
