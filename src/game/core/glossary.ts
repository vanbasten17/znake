export type GlossaryCategoryId = 'items' | 'powerups' | 'hazards' | 'enemies' | 'talents'

export type GlossaryMarkerTone =
  | 'core'
  | 'biomeCore'
  | 'portal'
  | 'battery'
  | 'beacon'
  | 'shield'
  | 'slow'
  | 'ghost'
  | 'score'
  | 'venom'
  | 'darkness'
  | 'squeeze'
  | 'ice'
  | 'sand'
  | 'rift'
  | 'enemyNormal'
  | 'enemyStalker'
  | 'enemyAmbusher'
  | 'enemyEgg'
  | 'enemyMirror'
  | 'enemyBoss'
  | 'talentSpeed'
  | 'talentSurvival'
  | 'talentHunt'

/** All marker tones (order used by sprite export / atlas). */
export const GLOSSARY_MARKER_TONES: GlossaryMarkerTone[] = [
  'core',
  'biomeCore',
  'portal',
  'battery',
  'beacon',
  'shield',
  'slow',
  'ghost',
  'score',
  'venom',
  'darkness',
  'squeeze',
  'ice',
  'sand',
  'rift',
  'enemyNormal',
  'enemyStalker',
  'enemyAmbusher',
  'enemyEgg',
  'enemyMirror',
  'enemyBoss',
  'talentSpeed',
  'talentSurvival',
  'talentHunt',
]

export type GlossaryEntry = {
  id: string
  category: GlossaryCategoryId
  marker: GlossaryMarkerTone
}

export const GLOSSARY_CATEGORIES: GlossaryCategoryId[] = [
  'items',
  'powerups',
  'hazards',
  'enemies',
  'talents',
]

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  { id: 'red_core', category: 'items', marker: 'core' },
  { id: 'coolant_charge', category: 'items', marker: 'battery' },
  { id: 'portal', category: 'items', marker: 'portal' },
  { id: 'rift_battery', category: 'items', marker: 'battery' },
  { id: 'portal_beacon', category: 'items', marker: 'beacon' },

  { id: 'power_shield', category: 'powerups', marker: 'shield' },
  { id: 'power_slow', category: 'powerups', marker: 'slow' },
  { id: 'power_ghost', category: 'powerups', marker: 'ghost' },
  { id: 'power_score', category: 'powerups', marker: 'score' },
  { id: 'power_venom', category: 'powerups', marker: 'venom' },

  { id: 'hazard_darkness', category: 'hazards', marker: 'darkness' },
  { id: 'hazard_squeeze', category: 'hazards', marker: 'squeeze' },
  { id: 'hazard_ice', category: 'hazards', marker: 'ice' },
  { id: 'hazard_sand', category: 'hazards', marker: 'sand' },
  { id: 'hazard_rift', category: 'hazards', marker: 'rift' },

  { id: 'enemy_normal', category: 'enemies', marker: 'enemyNormal' },
  { id: 'enemy_stalker', category: 'enemies', marker: 'enemyStalker' },
  { id: 'enemy_ambusher', category: 'enemies', marker: 'enemyAmbusher' },
  { id: 'enemy_egg', category: 'enemies', marker: 'enemyEgg' },
  { id: 'enemy_mirror', category: 'enemies', marker: 'enemyMirror' },
  { id: 'enemy_boss', category: 'enemies', marker: 'enemyBoss' },

  { id: 'talent_speed_1', category: 'talents', marker: 'talentSpeed' },
  { id: 'talent_speed_2', category: 'talents', marker: 'talentSpeed' },
  { id: 'talent_survival_1', category: 'talents', marker: 'talentSurvival' },
  { id: 'talent_survival_2', category: 'talents', marker: 'talentSurvival' },
  { id: 'talent_hunt_1', category: 'talents', marker: 'talentHunt' },
  { id: 'talent_hunt_2', category: 'talents', marker: 'talentHunt' },
]
