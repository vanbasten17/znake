import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { BASE_COLS, BASE_ROWS } from '../src/game/core/constants'
import type { Vec2 } from '../src/game/core/types'
import { cellKey, inInnerBounds } from '../src/game/simulation/grid'
import { generateClassicWalls } from '../src/game/simulation/layout'
import { createSeededRng } from '../src/game/simulation/rng'
import { pickOpenCell } from '../src/game/simulation/spawn'

type SmokeConfig = {
  cols: number
  rows: number
  maxTicks: number
  seeds: number[]
  outputPath: string
  baselinePath: string
  writeBaseline: boolean
  thresholds: {
    minP50Ticks: number
    minP50Food: number
    maxDeathRate: number
    minAvgChoiceDensity: number
    minAvgPathJaccard: number
  }
}

type DeathCause = 'wall' | 'body' | 'timeout' | 'none'

type SeedResult = {
  seed: number
  survivedTicks: number
  foodEaten: number
  died: boolean
  deathCause: DeathCause
  mapOpenRatio: number
  avgChoiceDensity: number
  avgLeniency: number
  avgAStarPathLen: number
  avgPathJaccard: number
}

type SmokeReport = {
  generatedAt: string
  config: SmokeConfig
  summary: {
    runs: number
    p50Ticks: number
    p50Food: number
    deathRate: number
    avgChoiceDensity: number
    avgLeniency: number
    avgAStarPathLen: number
    avgPathJaccard: number
    deathCauseBreakdown: Record<DeathCause, number>
    passed: boolean
    failures: string[]
    suggestedRectifications: string[]
  }
  seeds: SeedResult[]
}

const DEFAULT_OUTPUT = '.autoloop/smoke-last.json'
const DEFAULT_BASELINE = '.autoloop/smoke-baseline.json'

const dirs: Vec2[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

const parseArg = (name: string): string | null => {
  const prefix = `--${name}=`
  const found = process.argv.find((arg) => arg.startsWith(prefix))
  return found ? found.slice(prefix.length) : null
}

const hasFlag = (name: string): boolean => process.argv.includes(`--${name}`)

const toNumber = (value: string | null, fallback: number): number => {
  if (!value) {
    return fallback
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const parseSeeds = (): number[] => {
  const explicit = parseArg('seeds')
  if (explicit) {
    return explicit
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value) && value >= 0)
      .map((value) => Math.floor(value))
  }
  return [7, 13, 21, 34, 55, 89, 144, 233, 377, 610]
}

const percentile50 = (values: number[]): number => {
  if (values.length === 0) {
    return 0
  }
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor((sorted.length - 1) / 2)
  return sorted[mid] ?? 0
}

const mean = (values: number[]): number => {
  if (values.length === 0) {
    return 0
  }
  return values.reduce((acc, value) => acc + value, 0) / values.length
}

const getOpposite = (dir: Vec2): Vec2 => ({ x: -dir.x, y: -dir.y })

const isSnakeOccupying = (
  snake: ReadonlyArray<Vec2>,
  x: number,
  y: number,
  ignoreTail: boolean,
): boolean => {
  const length = ignoreTail ? snake.length - 1 : snake.length
  for (let i = 0; i < length; i += 1) {
    const segment = snake[i]
    if (segment && segment.x === x && segment.y === y) {
      return true
    }
  }
  return false
}

const countOpenNeighbors = (
  at: Vec2,
  walls: Set<string>,
  snake: ReadonlyArray<Vec2>,
  cols: number,
  rows: number,
): number => {
  let count = 0
  for (const dir of dirs) {
    const nx = at.x + dir.x
    const ny = at.y + dir.y
    if (!inInnerBounds(nx, ny, cols, rows)) {
      continue
    }
    if (walls.has(cellKey(nx, ny))) {
      continue
    }
    if (isSnakeOccupying(snake, nx, ny, false)) {
      continue
    }
    count += 1
  }
  return count
}

const reachableArea = (
  from: Vec2,
  walls: Set<string>,
  snake: ReadonlyArray<Vec2>,
  cols: number,
  rows: number,
): number => {
  const queue: Vec2[] = [from]
  const visited = new Set<string>([cellKey(from.x, from.y)])
  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      continue
    }
    for (const dir of dirs) {
      const nx = current.x + dir.x
      const ny = current.y + dir.y
      if (!inInnerBounds(nx, ny, cols, rows)) {
        continue
      }
      if (walls.has(cellKey(nx, ny))) {
        continue
      }
      if (isSnakeOccupying(snake, nx, ny, false)) {
        continue
      }
      const nextKey = cellKey(nx, ny)
      if (visited.has(nextKey)) {
        continue
      }
      visited.add(nextKey)
      queue.push({ x: nx, y: ny })
    }
  }
  return visited.size
}

const manhattan = (a: Vec2, b: Vec2): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

const aStarPath = (
  from: Vec2,
  to: Vec2,
  walls: Set<string>,
  snake: ReadonlyArray<Vec2>,
  cols: number,
  rows: number,
): Vec2[] => {
  const startKey = cellKey(from.x, from.y)
  const goalKey = cellKey(to.x, to.y)

  const open = new Set<string>([startKey])
  const cameFrom = new Map<string, string>()
  const gScore = new Map<string, number>([[startKey, 0]])
  const fScore = new Map<string, number>([[startKey, manhattan(from, to)]])

  const keyToVec = (key: string): Vec2 => {
    const [xRaw, yRaw] = key.split(',')
    return { x: Number(xRaw), y: Number(yRaw) }
  }

  while (open.size > 0) {
    let currentKey = ''
    let currentScore = Number.POSITIVE_INFINITY
    for (const candidate of open) {
      const score = fScore.get(candidate) ?? Number.POSITIVE_INFINITY
      if (score < currentScore) {
        currentScore = score
        currentKey = candidate
      }
    }

    if (!currentKey) {
      break
    }

    if (currentKey === goalKey) {
      const path: Vec2[] = []
      let walk: string | undefined = currentKey
      while (walk) {
        path.unshift(keyToVec(walk))
        walk = cameFrom.get(walk)
      }
      return path
    }

    open.delete(currentKey)
    const current = keyToVec(currentKey)

    for (const dir of dirs) {
      const nx = current.x + dir.x
      const ny = current.y + dir.y
      if (!inInnerBounds(nx, ny, cols, rows)) {
        continue
      }
      if (walls.has(cellKey(nx, ny))) {
        continue
      }
      if (isSnakeOccupying(snake, nx, ny, false) && !(nx === to.x && ny === to.y)) {
        continue
      }

      const neighborKey = cellKey(nx, ny)
      const tentativeG = (gScore.get(currentKey) ?? Number.POSITIVE_INFINITY) + 1
      if (tentativeG >= (gScore.get(neighborKey) ?? Number.POSITIVE_INFINITY)) {
        continue
      }

      cameFrom.set(neighborKey, currentKey)
      gScore.set(neighborKey, tentativeG)
      fScore.set(neighborKey, tentativeG + manhattan({ x: nx, y: ny }, to))
      open.add(neighborKey)
    }
  }

  return []
}

const jaccardSimilarity = (a: ReadonlyArray<Vec2>, b: ReadonlyArray<Vec2>): number => {
  const setA = new Set(a.map((cell) => cellKey(cell.x, cell.y)))
  const setB = new Set(b.map((cell) => cellKey(cell.x, cell.y)))
  if (setA.size === 0 && setB.size === 0) {
    return 1
  }

  let intersection = 0
  for (const key of setA) {
    if (setB.has(key)) {
      intersection += 1
    }
  }
  const union = new Set([...setA, ...setB]).size
  return union === 0 ? 0 : intersection / union
}

const chooseDirection = (params: {
  head: Vec2
  snake: ReadonlyArray<Vec2>
  currentDir: Vec2
  food: Vec2
  walls: Set<string>
  cols: number
  rows: number
  mapOpenCells: number
}): Vec2 => {
  const { head, snake, currentDir, food, walls, cols, rows, mapOpenCells } = params
  const opposite = getOpposite(currentDir)

  let best = currentDir
  let bestScore = Number.NEGATIVE_INFINITY

  for (const dir of dirs) {
    if (dir.x === opposite.x && dir.y === opposite.y) {
      continue
    }

    const nx = head.x + dir.x
    const ny = head.y + dir.y
    if (!inInnerBounds(nx, ny, cols, rows) || walls.has(cellKey(nx, ny))) {
      continue
    }

    const willEat = nx === food.x && ny === food.y
    if (isSnakeOccupying(snake, nx, ny, !willEat)) {
      continue
    }

    const next = { x: nx, y: ny }
    const area = reachableArea(next, walls, snake, cols, rows)
    const leniency = mapOpenCells <= 0 ? 0 : area / mapOpenCells
    const choiceDensity = countOpenNeighbors(next, walls, snake, cols, rows)
    const distance = manhattan(next, food)

    const score =
      area * 1.5 + leniency * 100 + choiceDensity * 10 - distance * 3 + (willEat ? 500 : 0)

    if (score > bestScore) {
      bestScore = score
      best = dir
    }
  }

  return best
}

const buildWalls = (seed: number, cols: number, rows: number): Set<string> => {
  const rng = createSeededRng(seed)
  return generateClassicWalls({
    cols,
    rows,
    wallCount: 7,
    centerSafeRadius: 3,
    rng,
  })
}

const spawnFood = (params: {
  seed: number
  step: number
  cols: number
  rows: number
  walls: Set<string>
  snake: ReadonlyArray<Vec2>
}): Vec2 => {
  const { seed, step, cols, rows, walls, snake } = params
  const rng = createSeededRng(seed + step * 7919)
  return pickOpenCell({
    cols,
    rows,
    occupancy: {
      walls,
      snake,
      enemies: [],
    },
    rng,
    minDistanceFromCenter: 1,
    fairness: {
      bodyLength: 1,
      minOpenNeighborCount: 1,
    },
  })
}

const runOne = (seed: number, config: SmokeConfig): SeedResult => {
  const walls = buildWalls(seed, config.cols, config.rows)
  const cx = Math.floor(config.cols / 2)
  const cy = Math.floor(config.rows / 2)
  const totalInnerCells = Math.max(1, (config.cols - 2) * (config.rows - 2))
  const mapOpenCells = Math.max(1, totalInnerCells - walls.size)

  const snake: Vec2[] = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ]

  for (const segment of snake) {
    walls.delete(cellKey(segment.x, segment.y))
  }

  let direction: Vec2 = { x: 1, y: 0 }
  let food = spawnFood({ seed, step: 0, cols: config.cols, rows: config.rows, walls, snake })
  let foodEaten = 0
  let deathCause: DeathCause = 'none'

  let totalChoiceDensity = 0
  let totalLeniency = 0
  let totalAStarPathLen = 0
  let totalJaccard = 0
  let jaccardSamples = 0

  let chaseTrace: Vec2[] = [{ x: snake[0]?.x ?? cx, y: snake[0]?.y ?? cy }]
  let chaseOptimalPath = aStarPath(
    chaseTrace[0] ?? { x: cx, y: cy },
    food,
    walls,
    snake,
    config.cols,
    config.rows,
  )

  for (let tick = 1; tick <= config.maxTicks; tick += 1) {
    const head = snake[0]
    if (!head) {
      deathCause = 'body'
      return {
        seed,
        survivedTicks: tick - 1,
        foodEaten,
        died: true,
        deathCause,
        mapOpenRatio: mapOpenCells / totalInnerCells,
        avgChoiceDensity: tick > 1 ? totalChoiceDensity / (tick - 1) : 0,
        avgLeniency: tick > 1 ? totalLeniency / (tick - 1) : 0,
        avgAStarPathLen: foodEaten > 0 ? totalAStarPathLen / foodEaten : 0,
        avgPathJaccard: jaccardSamples > 0 ? totalJaccard / jaccardSamples : 0,
      }
    }

    direction = chooseDirection({
      head,
      snake,
      currentDir: direction,
      food,
      walls,
      cols: config.cols,
      rows: config.rows,
      mapOpenCells,
    })

    const nextHead = { x: head.x + direction.x, y: head.y + direction.y }

    if (!inInnerBounds(nextHead.x, nextHead.y, config.cols, config.rows)) {
      deathCause = 'wall'
      return {
        seed,
        survivedTicks: tick - 1,
        foodEaten,
        died: true,
        deathCause,
        mapOpenRatio: mapOpenCells / totalInnerCells,
        avgChoiceDensity: tick > 1 ? totalChoiceDensity / (tick - 1) : 0,
        avgLeniency: tick > 1 ? totalLeniency / (tick - 1) : 0,
        avgAStarPathLen: foodEaten > 0 ? totalAStarPathLen / foodEaten : 0,
        avgPathJaccard: jaccardSamples > 0 ? totalJaccard / jaccardSamples : 0,
      }
    }

    if (walls.has(cellKey(nextHead.x, nextHead.y))) {
      deathCause = 'wall'
      return {
        seed,
        survivedTicks: tick - 1,
        foodEaten,
        died: true,
        deathCause,
        mapOpenRatio: mapOpenCells / totalInnerCells,
        avgChoiceDensity: tick > 1 ? totalChoiceDensity / (tick - 1) : 0,
        avgLeniency: tick > 1 ? totalLeniency / (tick - 1) : 0,
        avgAStarPathLen: foodEaten > 0 ? totalAStarPathLen / foodEaten : 0,
        avgPathJaccard: jaccardSamples > 0 ? totalJaccard / jaccardSamples : 0,
      }
    }

    const willEat = nextHead.x === food.x && nextHead.y === food.y
    if (isSnakeOccupying(snake, nextHead.x, nextHead.y, !willEat)) {
      deathCause = 'body'
      return {
        seed,
        survivedTicks: tick - 1,
        foodEaten,
        died: true,
        deathCause,
        mapOpenRatio: mapOpenCells / totalInnerCells,
        avgChoiceDensity: tick > 1 ? totalChoiceDensity / (tick - 1) : 0,
        avgLeniency: tick > 1 ? totalLeniency / (tick - 1) : 0,
        avgAStarPathLen: foodEaten > 0 ? totalAStarPathLen / foodEaten : 0,
        avgPathJaccard: jaccardSamples > 0 ? totalJaccard / jaccardSamples : 0,
      }
    }

    const openChoices = countOpenNeighbors(nextHead, walls, snake, config.cols, config.rows)
    totalChoiceDensity += openChoices

    const area = reachableArea(nextHead, walls, snake, config.cols, config.rows)
    const leniency = mapOpenCells <= 0 ? 0 : area / mapOpenCells
    totalLeniency += leniency

    snake.unshift(nextHead)
    chaseTrace.push({ x: nextHead.x, y: nextHead.y })

    if (willEat) {
      foodEaten += 1
      if (chaseOptimalPath.length > 0) {
        totalAStarPathLen += Math.max(0, chaseOptimalPath.length - 1)
      }
      totalJaccard += jaccardSimilarity(chaseTrace, chaseOptimalPath)
      jaccardSamples += 1

      food = spawnFood({
        seed,
        step: tick,
        cols: config.cols,
        rows: config.rows,
        walls,
        snake,
      })

      chaseTrace = [{ x: nextHead.x, y: nextHead.y }]
      chaseOptimalPath = aStarPath(nextHead, food, walls, snake, config.cols, config.rows)
    } else {
      snake.pop()
    }
  }

  return {
    seed,
    survivedTicks: config.maxTicks,
    foodEaten,
    died: false,
    deathCause,
    mapOpenRatio: mapOpenCells / totalInnerCells,
    avgChoiceDensity: config.maxTicks > 0 ? totalChoiceDensity / config.maxTicks : 0,
    avgLeniency: config.maxTicks > 0 ? totalLeniency / config.maxTicks : 0,
    avgAStarPathLen: foodEaten > 0 ? totalAStarPathLen / foodEaten : 0,
    avgPathJaccard: jaccardSamples > 0 ? totalJaccard / jaccardSamples : 0,
  }
}

const safeReadBaseline = (path: string): Partial<SmokeConfig['thresholds']> | null => {
  try {
    const raw = readFileSync(path, 'utf8')
    const parsed = JSON.parse(raw) as SmokeReport
    return {
      minP50Ticks: Math.floor(parsed.summary.p50Ticks * 0.95),
      minP50Food: Math.max(1, Math.floor(parsed.summary.p50Food * 0.9)),
      maxDeathRate: Math.min(1, parsed.summary.deathRate + 0.1),
      minAvgChoiceDensity: Math.max(0.1, parsed.summary.avgChoiceDensity * 0.9),
      minAvgPathJaccard: Math.max(0.05, parsed.summary.avgPathJaccard * 0.8),
    }
  } catch {
    return null
  }
}

const main = (): void => {
  const seeds = parseSeeds()
  const outputPath = parseArg('output') ?? DEFAULT_OUTPUT
  const baselinePath = parseArg('baseline') ?? DEFAULT_BASELINE

  const absoluteThresholds = {
    minP50Ticks: toNumber(parseArg('min-p50-ticks'), 140),
    minP50Food: toNumber(parseArg('min-p50-food'), 4),
    maxDeathRate: toNumber(parseArg('max-death-rate'), 0.7),
    minAvgChoiceDensity: toNumber(parseArg('min-choice-density'), 1.2),
    minAvgPathJaccard: toNumber(parseArg('min-path-jaccard'), 0.1),
  }

  const baselineThresholds = safeReadBaseline(baselinePath)
  const thresholds = {
    minP50Ticks: Math.max(absoluteThresholds.minP50Ticks, baselineThresholds?.minP50Ticks ?? 0),
    minP50Food: Math.max(absoluteThresholds.minP50Food, baselineThresholds?.minP50Food ?? 0),
    maxDeathRate: Math.min(
      absoluteThresholds.maxDeathRate,
      baselineThresholds?.maxDeathRate ?? absoluteThresholds.maxDeathRate,
    ),
    minAvgChoiceDensity: Math.max(
      absoluteThresholds.minAvgChoiceDensity,
      baselineThresholds?.minAvgChoiceDensity ?? 0,
    ),
    minAvgPathJaccard: Math.max(
      absoluteThresholds.minAvgPathJaccard,
      baselineThresholds?.minAvgPathJaccard ?? 0,
    ),
  }

  const config: SmokeConfig = {
    cols: toNumber(parseArg('cols'), BASE_COLS),
    rows: toNumber(parseArg('rows'), BASE_ROWS),
    maxTicks: toNumber(parseArg('max-ticks'), 500),
    seeds,
    outputPath,
    baselinePath,
    writeBaseline: hasFlag('write-baseline'),
    thresholds,
  }

  const results = seeds.map((seed) => runOne(seed, config))
  const p50Ticks = percentile50(results.map((result) => result.survivedTicks))
  const p50Food = percentile50(results.map((result) => result.foodEaten))
  const deathRate =
    results.length === 0 ? 1 : results.filter((result) => result.died).length / results.length
  const avgChoiceDensity = mean(results.map((result) => result.avgChoiceDensity))
  const avgLeniency = mean(results.map((result) => result.avgLeniency))
  const avgAStarPathLen = mean(results.map((result) => result.avgAStarPathLen))
  const avgPathJaccard = mean(results.map((result) => result.avgPathJaccard))

  const deathCauseBreakdown: Record<DeathCause, number> = {
    wall: 0,
    body: 0,
    timeout: 0,
    none: 0,
  }
  for (const result of results) {
    deathCauseBreakdown[result.deathCause] += 1
  }

  const failures: string[] = []
  if (p50Ticks < config.thresholds.minP50Ticks) {
    failures.push(`p50 ticks ${p50Ticks} < min ${config.thresholds.minP50Ticks}`)
  }
  if (p50Food < config.thresholds.minP50Food) {
    failures.push(`p50 food ${p50Food} < min ${config.thresholds.minP50Food}`)
  }
  if (deathRate > config.thresholds.maxDeathRate) {
    failures.push(
      `death rate ${deathRate.toFixed(3)} > max ${config.thresholds.maxDeathRate.toFixed(3)}`,
    )
  }
  if (avgChoiceDensity < config.thresholds.minAvgChoiceDensity) {
    failures.push(
      `avg choice density ${avgChoiceDensity.toFixed(2)} < min ${config.thresholds.minAvgChoiceDensity.toFixed(2)}`,
    )
  }
  if (avgPathJaccard < config.thresholds.minAvgPathJaccard) {
    failures.push(
      `avg path jaccard ${avgPathJaccard.toFixed(3)} < min ${config.thresholds.minAvgPathJaccard.toFixed(3)}`,
    )
  }

  const suggestedRectifications: string[] = []
  if (
    p50Ticks < config.thresholds.minP50Ticks ||
    deathCauseBreakdown.wall > deathCauseBreakdown.body
  ) {
    suggestedRectifications.push(
      'Reduce map wall density or widen safe corridors to improve attributable failures and survival leniency.',
    )
  }
  if (avgChoiceDensity < config.thresholds.minAvgChoiceDensity) {
    suggestedRectifications.push(
      'Increase tactical choice density by reducing dead-ends and forcing fewer single-path funnels.',
    )
  }
  if (avgPathJaccard < config.thresholds.minAvgPathJaccard) {
    suggestedRectifications.push(
      'Review path readability: align reward placement with intended optimal-route affordances and clearer telegraphing.',
    )
  }
  if (p50Food < config.thresholds.minP50Food) {
    suggestedRectifications.push(
      'Tune spawn fairness and pacing so reachable rewards appear at learning-friendly distances.',
    )
  }
  if (suggestedRectifications.length === 0) {
    suggestedRectifications.push('No rectifications required for current thresholds.')
  }

  const report: SmokeReport = {
    generatedAt: new Date().toISOString(),
    config,
    summary: {
      runs: results.length,
      p50Ticks,
      p50Food,
      deathRate,
      avgChoiceDensity,
      avgLeniency,
      avgAStarPathLen,
      avgPathJaccard,
      deathCauseBreakdown,
      passed: failures.length === 0,
      failures,
      suggestedRectifications,
    },
    seeds: results,
  }

  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, JSON.stringify(report, null, 2))

  if (config.writeBaseline) {
    mkdirSync(dirname(config.baselinePath), { recursive: true })
    writeFileSync(config.baselinePath, JSON.stringify(report, null, 2))
  }

  for (const seedResult of results) {
    console.log(
      `[smoke] seed=${seedResult.seed} ticks=${seedResult.survivedTicks} food=${seedResult.foodEaten} died=${seedResult.died} cause=${seedResult.deathCause}`,
    )
  }

  console.log(
    `[smoke] p50Ticks=${p50Ticks} p50Food=${p50Food} deathRate=${deathRate.toFixed(3)} choice=${avgChoiceDensity.toFixed(2)} jaccard=${avgPathJaccard.toFixed(3)} passed=${report.summary.passed}`,
  )
  console.log(`[smoke] report=${outputPath}`)
  console.log('[smoke] suggested rectifications:')
  for (const item of suggestedRectifications) {
    console.log(`[smoke] - ${item}`)
  }

  if (!report.summary.passed) {
    console.error(`[smoke] FAIL: ${report.summary.failures.join(' | ')}`)
    process.exitCode = 1
  }
}

main()
