import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const STATE_PATH = '.autoloop/state.json'
const REPORT_PATH = '.autoloop/loop-report.json'
const PROMPT_PACK_PATH = '.autoloop/prompt-pack.md'
const COMMIT_MESSAGE_PATH = '.autoloop/commit-message.txt'

const getArg = (name) => {
  const prefix = `--${name}=`
  const found = process.argv.find((arg) => arg.startsWith(prefix))
  return found ? found.slice(prefix.length) : null
}

const hasFlag = (name) => process.argv.includes(`--${name}`)

const writeJson = (path, value) => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(value, null, 2))
}

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: options.capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
  })
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
}

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const extractUnmatchedItems = (text) => {
  const sectionStart = text.indexOf('### Unmatched')
  if (sectionStart === -1) {
    return []
  }
  const nextSection = text.indexOf('\n### ', sectionStart + 1)
  const body = nextSection === -1 ? text.slice(sectionStart) : text.slice(sectionStart, nextSection)
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean)
}

const buildPromptPack = ({ changeName, unmatchedItems }) => {
  const lines = []
  lines.push('# Autoloop Prompt Pack')
  lines.push('')
  lines.push('Low-IA mode: reuse these prompts directly instead of drafting new ones every cycle.')
  lines.push('')

  if (changeName) {
    lines.push('## Active Change Apply Prompt')
    lines.push('')
    lines.push('Use the `openspec-apply-change` skill for this thread.')
    lines.push('')
    lines.push(`Continue the OpenSpec change \`${changeName}\` and implement only pending tasks.`)
    lines.push('')
    lines.push('Constraints:')
    lines.push('- keep changes minimal and deterministic')
    lines.push('- keep GameScene orchestration thin')
    lines.push(
      '- run `pnpm check`, then `pnpm smoke`, then `openspec validate --type change --strict`',
    )
    lines.push('')
  }

  if (unmatchedItems.length > 0) {
    lines.push('## Suggested Propose Prompts From NEXT_STEPS')
    lines.push('')
    unmatchedItems.slice(0, 3).forEach((item, index) => {
      const guessName = slugify(item).slice(0, 52) || `next-step-${index + 1}`
      lines.push(`${index + 1}. \`${guessName}\``)
      lines.push(`- Goal: ${item}`)
      lines.push(
        '- Prompt: Use `openspec-propose` to create proposal/design/tasks/spec deltas for this goal with a bounded MVP scope.',
      )
    })
    lines.push('')
  }

  lines.push('## Archive Prompt')
  lines.push('')
  lines.push(
    'When all tasks are done and gates pass, ask to archive and then run `openspec archive <change> -y`.',
  )
  lines.push('')
  return `${lines.join('\n')}\n`
}

const getActiveChanges = () => {
  const list = run('openspec', ['list', '--json'], { capture: true })
  if (!list.ok) {
    throw new Error(`openspec list failed: ${list.stderr || list.stdout}`)
  }
  const parsed = JSON.parse(list.stdout)
  return Array.isArray(parsed.changes) ? parsed.changes : []
}

const readNextSteps = () => {
  try {
    return readFileSync('NEXT_STEPS.md', 'utf8')
  } catch {
    return ''
  }
}

const stageResult = (name, result) => ({
  stage: name,
  ok: result.ok,
  status: result.status,
  at: new Date().toISOString(),
})

const main = () => {
  const autoarchive = hasFlag('autoarchive')
  const autocommit = hasFlag('autocommit')
  const selectedChange = getArg('change')

  const state = {
    startedAt: new Date().toISOString(),
    selectedChange,
    autoarchive,
    autocommit,
    stages: [],
  }

  const nextSteps = readNextSteps()
  const unmatchedItems = extractUnmatchedItems(nextSteps)

  const changes = getActiveChanges()
  const change =
    (selectedChange && changes.find((entry) => entry.name === selectedChange)) ||
    (changes.length > 0 ? changes[0] : null)

  mkdirSync(dirname(PROMPT_PACK_PATH), { recursive: true })
  writeFileSync(
    PROMPT_PACK_PATH,
    buildPromptPack({
      changeName: change?.name ?? null,
      unmatchedItems,
    }),
  )

  if (!change) {
    state.finishedAt = new Date().toISOString()
    state.summary =
      'No active OpenSpec changes found. Prompt pack generated from NEXT_STEPS unmatched items.'
    writeJson(STATE_PATH, state)
    writeJson(REPORT_PATH, {
      passed: true,
      summary: state.summary,
      promptPackPath: PROMPT_PACK_PATH,
    })
    console.log('[autoloop] no active change; generated prompt pack only')
    console.log(`[autoloop] prompt pack: ${PROMPT_PACK_PATH}`)
    return
  }

  state.change = change.name

  const commitMessage = `chore(autoloop): smoke-gated loop for ${change.name}`
  mkdirSync(dirname(COMMIT_MESSAGE_PATH), { recursive: true })
  writeFileSync(COMMIT_MESSAGE_PATH, `${commitMessage}\n`)

  const check = run('pnpm', ['check'])
  state.stages.push(stageResult('check', check))
  if (!check.ok) {
    state.finishedAt = new Date().toISOString()
    state.summary = 'Stopped at pnpm check.'
    writeJson(STATE_PATH, state)
    writeJson(REPORT_PATH, {
      passed: false,
      failedStage: 'check',
      promptPackPath: PROMPT_PACK_PATH,
      commitMessagePath: COMMIT_MESSAGE_PATH,
    })
    process.exit(1)
  }

  const smoke = run('pnpm', ['smoke'])
  state.stages.push(stageResult('smoke', smoke))
  if (!smoke.ok) {
    state.finishedAt = new Date().toISOString()
    state.summary = 'Stopped at pnpm smoke.'
    writeJson(STATE_PATH, state)
    writeJson(REPORT_PATH, {
      passed: false,
      failedStage: 'smoke',
      promptPackPath: PROMPT_PACK_PATH,
      commitMessagePath: COMMIT_MESSAGE_PATH,
    })
    process.exit(1)
  }

  const validate = run('openspec', ['validate', change.name, '--type', 'change', '--strict'])
  state.stages.push(stageResult('openspec-validate', validate))
  if (!validate.ok) {
    state.finishedAt = new Date().toISOString()
    state.summary = 'Stopped at openspec validate.'
    writeJson(STATE_PATH, state)
    writeJson(REPORT_PATH, {
      passed: false,
      failedStage: 'openspec-validate',
      promptPackPath: PROMPT_PACK_PATH,
      commitMessagePath: COMMIT_MESSAGE_PATH,
    })
    process.exit(1)
  }

  if (autoarchive) {
    const archive = run('openspec', ['archive', change.name, '-y'])
    state.stages.push(stageResult('archive', archive))
    if (!archive.ok) {
      state.finishedAt = new Date().toISOString()
      state.summary = 'Stopped at archive.'
      writeJson(STATE_PATH, state)
      writeJson(REPORT_PATH, {
        passed: false,
        failedStage: 'archive',
        promptPackPath: PROMPT_PACK_PATH,
        commitMessagePath: COMMIT_MESSAGE_PATH,
      })
      process.exit(1)
    }
  }

  if (autocommit) {
    const add = run('git', ['add', '-A'])
    state.stages.push(stageResult('git-add', add))
    if (!add.ok) {
      state.finishedAt = new Date().toISOString()
      state.summary = 'Stopped at git add.'
      writeJson(STATE_PATH, state)
      writeJson(REPORT_PATH, {
        passed: false,
        failedStage: 'git-add',
        promptPackPath: PROMPT_PACK_PATH,
        commitMessagePath: COMMIT_MESSAGE_PATH,
      })
      process.exit(1)
    }

    const commit = run('git', ['commit', '-m', commitMessage])
    state.stages.push(stageResult('git-commit', commit))
    if (!commit.ok) {
      state.finishedAt = new Date().toISOString()
      state.summary = 'git commit failed (possibly no staged changes).'
      writeJson(STATE_PATH, state)
      writeJson(REPORT_PATH, {
        passed: false,
        failedStage: 'git-commit',
        promptPackPath: PROMPT_PACK_PATH,
        commitMessagePath: COMMIT_MESSAGE_PATH,
      })
      process.exit(1)
    }
  }

  state.finishedAt = new Date().toISOString()
  state.summary = 'Autoloop completed all configured stages.'
  writeJson(STATE_PATH, state)
  writeJson(REPORT_PATH, {
    passed: true,
    change: change.name,
    autoarchive,
    autocommit,
    promptPackPath: PROMPT_PACK_PATH,
    commitMessagePath: COMMIT_MESSAGE_PATH,
    smokeReportPath: '.autoloop/smoke-last.json',
  })

  console.log(`[autoloop] completed for change: ${change.name}`)
  console.log(`[autoloop] prompt pack: ${PROMPT_PACK_PATH}`)
  console.log(`[autoloop] commit message: ${COMMIT_MESSAGE_PATH}`)
}

main()
