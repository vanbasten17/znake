import type { GlossaryMarkerTone } from '../core/glossary'

/**
 * Semantic roles for marker color language (player-helping vs harmful vs hostile).
 * Used by `markerRenderer` for fills and glyph contrast.
 */
export type MarkerSemanticRole = 'benefit' | 'hazard' | 'terrain' | 'enemy'

export const MARKER_SEMANTIC_ROLE: Record<GlossaryMarkerTone, MarkerSemanticRole> = {
  /** Food, pickups, powerups, talents — help the run */
  core: 'benefit',
  biomeCore: 'benefit',
  portal: 'benefit',
  battery: 'benefit',
  beacon: 'benefit',
  shield: 'benefit',
  slow: 'benefit',
  ghost: 'benefit',
  score: 'benefit',
  venom: 'benefit',
  /** Environmental dangers */
  darkness: 'hazard',
  squeeze: 'hazard',
  rift: 'hazard',
  /** Floor modifiers — hinder movement */
  ice: 'terrain',
  sand: 'terrain',
  /** Hostile actors */
  enemyNormal: 'enemy',
  enemyStalker: 'enemy',
  enemyAmbusher: 'enemy',
  enemyEgg: 'enemy',
  enemyMirror: 'enemy',
  enemyBoss: 'enemy',
  talentSpeed: 'benefit',
  talentSurvival: 'benefit',
  talentHunt: 'benefit',
}
