import type { BiomeId } from '../core/types'

export type BiomeColorScript = {
  bg: number
  deepGrid: number
  mainGrid: number
  star: number
  nebulaPrimary: number
  nebulaSecondary: number
  wallFill: number
  wallCore: number
  wallAccent: number
  wallStroke: number
}

const BIOME_COLOR_SCRIPTS: Record<BiomeId, BiomeColorScript> = {
  'void-depths': {
    bg: 0x040814,
    deepGrid: 0x1a1a45,
    mainGrid: 0x2a3a78,
    star: 0x99ccff,
    nebulaPrimary: 0x1a0a35,
    nebulaSecondary: 0x0a1a45,
    wallFill: 0x1b224e,
    wallCore: 0x11183b,
    wallAccent: 0x4b63da,
    wallStroke: 0x6f85ff,
  },
  'crystal-caverns': {
    bg: 0x031114,
    deepGrid: 0x0f3e4d,
    mainGrid: 0x1f6275,
    star: 0xb7fff5,
    nebulaPrimary: 0x0f2f42,
    nebulaSecondary: 0x0a4b5c,
    wallFill: 0x1a3d4a,
    wallCore: 0x0e2430,
    wallAccent: 0x54b9cf,
    wallStroke: 0x8de7ff,
  },
  'ember-fields': {
    bg: 0x160905,
    deepGrid: 0x4a2418,
    mainGrid: 0x6e3622,
    star: 0xffd9ab,
    nebulaPrimary: 0x3f170d,
    nebulaSecondary: 0x5a2916,
    wallFill: 0x4a2a1d,
    wallCore: 0x28150f,
    wallAccent: 0xd67a3c,
    wallStroke: 0xffb776,
  },
}

export const resolveBiomeColorScript = (
  biomeId: BiomeId,
  highContrast: boolean,
): BiomeColorScript => {
  const script = BIOME_COLOR_SCRIPTS[biomeId]
  if (!highContrast) {
    return script
  }
  return {
    ...script,
    mainGrid: script.wallStroke,
    star: 0xffffff,
    wallStroke: 0xffffff,
  }
}
