import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { evaluateFairnessValidationSuite } from '../src/game/tooling/fairnessValidation'

const DEFAULT_OUTPUT_PATH = '/tmp/znake-fairness-validation-last.json'

const parseArg = (name: string): string | null => {
  const prefix = `--${name}=`
  const found = process.argv.find((arg) => arg.startsWith(prefix))
  return found ? found.slice(prefix.length) : null
}

const outputPath = parseArg('output') ?? DEFAULT_OUTPUT_PATH
const report = evaluateFairnessValidationSuite()

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, JSON.stringify(report, null, 2))

for (const band of ['early', 'mid', 'late'] as const) {
  const summary = report.depthBands[band]
  console.log(
    `[fairness] band=${band} floor=${summary.floor} reactionMs=${summary.metrics.reactionWindowMsAvg.toFixed(1)} recoverability=${summary.metrics.recoverabilityRateAvg.toFixed(3)} cheapHit=${summary.metrics.cheapHitRateAvg.toFixed(3)} pass=${summary.pass.reactionWindowMs && summary.pass.recoverabilityRate && summary.pass.cheapHitRate}`,
  )
}
console.log(`[fairness] report=${outputPath}`)

if (!report.summary.passed) {
  console.error(`[fairness] FAIL: ${report.summary.failures.join(' | ')}`)
  process.exit(1)
}
