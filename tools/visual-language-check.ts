import { GLOSSARY_MARKER_TONES } from '../src/game/core/glossary'
import { MARKER_VISUAL_TOKEN, validateVisualLanguage } from '../src/game/visual/visualLanguage'

const issues = validateVisualLanguage()

console.log('Znake visual language check')
console.log(
  `- mapped tones: ${Object.keys(MARKER_VISUAL_TOKEN).length}/${GLOSSARY_MARKER_TONES.length}`,
)

if (issues.length === 0) {
  console.log('✓ No ambiguity or mapping issues found')
  process.exit(0)
}

console.log('Found visual language issues:')
for (const issue of issues) {
  console.log(`- ${issue}`)
}
process.exit(1)
