import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const SIMULATION_DIR = path.join(ROOT, 'src', 'game', 'simulation')
const SCENES_DIR = path.join(ROOT, 'src', 'game', 'scenes')

const FORBIDDEN_SIMULATION_PATTERNS = [
  { name: 'window', regex: /\bwindow\b/ },
  { name: 'document', regex: /\bdocument\b/ },
  { name: 'localStorage', regex: /\blocalStorage\b/ },
  { name: 'sessionStorage', regex: /\bsessionStorage\b/ },
  { name: 'Phaser', regex: /\bPhaser\b/ },
]

const SCENE_BUDGETS = {
  'GameScene.ts': { maxLines: 5800, maxImports: 70 },
  'MenuScene.ts': { maxLines: 1500, maxImports: 75 },
  'DeathScene.ts': { maxLines: 700, maxImports: 35 },
  'UpgradeScene.ts': { maxLines: 350, maxImports: 35 },
  'RelicDraftScene.ts': { maxLines: 250, maxImports: 30 },
}

const walkFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return walkFiles(fullPath)
      }
      return [fullPath]
    }),
  )
  return files.flat()
}

const countImports = (source) =>
  source.split('\n').filter((line) => line.startsWith('import ')).length

const reportAndExit = (errors) => {
  if (errors.length === 0) {
    console.info('[architecture-guardrails] OK')
    return
  }
  console.error('[architecture-guardrails] FAIL')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  console.error(
    'Extraction-first remediation: move duplicated or mixed-responsibility logic into shared helpers.',
  )
  process.exitCode = 1
}

const checkSimulationBoundaries = async () => {
  const files = (await walkFiles(SIMULATION_DIR)).filter((file) => file.endsWith('.ts'))
  const errors = []
  for (const file of files) {
    const source = await readFile(file, 'utf8')
    for (const pattern of FORBIDDEN_SIMULATION_PATTERNS) {
      if (pattern.regex.test(source)) {
        errors.push(
          `Forbidden side-effect dependency "${pattern.name}" in ${path.relative(ROOT, file)}`,
        )
      }
    }
  }
  return errors
}

const checkSceneBudgets = async () => {
  const files = (await walkFiles(SCENES_DIR)).filter((file) => file.endsWith('Scene.ts'))
  const errors = []
  for (const file of files) {
    const name = path.basename(file)
    const budget = SCENE_BUDGETS[name]
    if (!budget) {
      continue
    }
    const source = await readFile(file, 'utf8')
    const lineCount = source.split('\n').length
    const importCount = countImports(source)
    if (lineCount > budget.maxLines) {
      errors.push(
        `${path.relative(ROOT, file)} exceeds line budget (${lineCount}/${budget.maxLines})`,
      )
    }
    if (importCount > budget.maxImports) {
      errors.push(
        `${path.relative(ROOT, file)} exceeds import budget (${importCount}/${budget.maxImports})`,
      )
    }
  }
  return errors
}

const main = async () => {
  const [simulationErrors, sceneErrors] = await Promise.all([
    checkSimulationBoundaries(),
    checkSceneBudgets(),
  ])
  reportAndExit([...simulationErrors, ...sceneErrors])
}

await main()
