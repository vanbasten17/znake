import type { GlossaryMarkerTone } from '../core/glossary'
import { getVisualToken } from '../visual/visualLanguage'

/**
 * Semantic roles for marker color language (player-helping vs harmful vs hostile).
 * Used by `markerRenderer` for fills and glyph contrast.
 */
export type MarkerSemanticRole = 'benefit' | 'hazard' | 'terrain' | 'enemy'

const toSemanticRole = (tone: GlossaryMarkerTone): MarkerSemanticRole => {
  const token = getVisualToken(tone)
  if (token.category === 'enemy') return 'enemy'
  if (token.category === 'obstacle') return 'terrain'
  if (token.intent === 'danger') return 'hazard'
  return 'benefit'
}

export const MARKER_SEMANTIC_ROLE: Record<GlossaryMarkerTone, MarkerSemanticRole> = {
  core: toSemanticRole('core'),
  biomeCore: toSemanticRole('biomeCore'),
  portal: toSemanticRole('portal'),
  battery: toSemanticRole('battery'),
  beacon: toSemanticRole('beacon'),
  shield: toSemanticRole('shield'),
  slow: toSemanticRole('slow'),
  ghost: toSemanticRole('ghost'),
  score: toSemanticRole('score'),
  venom: toSemanticRole('venom'),
  darkness: toSemanticRole('darkness'),
  squeeze: toSemanticRole('squeeze'),
  ice: toSemanticRole('ice'),
  sand: toSemanticRole('sand'),
  rift: toSemanticRole('rift'),
  enemyNormal: toSemanticRole('enemyNormal'),
  enemyStalker: toSemanticRole('enemyStalker'),
  enemyAmbusher: toSemanticRole('enemyAmbusher'),
  enemyEgg: toSemanticRole('enemyEgg'),
  enemyMirror: toSemanticRole('enemyMirror'),
  enemyBoss: toSemanticRole('enemyBoss'),
  talentSpeed: toSemanticRole('talentSpeed'),
  talentSurvival: toSemanticRole('talentSurvival'),
  talentHunt: toSemanticRole('talentHunt'),
}
