import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'

type CliOptions = {
  inputDir: string
  outputDir: string
  size: number
  dryRun: boolean
}

const parseArgs = (): CliOptions => {
  const args = process.argv.slice(2)
  const getArg = (name: string): string | null => {
    const pref = `--${name}=`
    const inline = args.find((value) => value.startsWith(pref))
    if (inline) {
      return inline.slice(pref.length)
    }
    const index = args.findIndex((value) => value === `--${name}`)
    if (index >= 0) {
      return args[index + 1] ?? null
    }
    return null
  }

  const dryRun = args.includes('--dry-run')
  const defaultOut = dryRun ? 'assets/sprites/previews' : 'assets/sprites/generated'

  const inputDir = getArg('in') ?? 'assets/sprites/source'
  const outputDir = getArg('out') ?? defaultOut
  const sizeRaw = getArg('size')
  const parsedSize = sizeRaw ? Number.parseInt(sizeRaw, 10) : 40
  const size = Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : 40

  return { inputDir, outputDir, size, dryRun }
}

const run = async (): Promise<void> => {
  const options = parseArgs()
  const inputAbs = path.resolve(options.inputDir)
  const outputAbs = path.resolve(options.outputDir)

  const dirEntries = await fs.readdir(inputAbs, { withFileTypes: true })
  const svgFiles = dirEntries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  if (svgFiles.length === 0) {
    console.log(`[svg2png] No SVG files found in ${inputAbs}`)
    return
  }

  await fs.mkdir(outputAbs, { recursive: true })
  let converted = 0

  for (const fileName of svgFiles) {
    const sourcePath = path.join(inputAbs, fileName)
    const targetPath = path.join(outputAbs, fileName.replace(/\.svg$/i, '.png'))
    const svg = await fs.readFile(sourcePath, 'utf8')
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: options.size,
      },
      background: 'rgba(0,0,0,0)',
    })
    const pngBuffer = resvg.render().asPng()
    await fs.writeFile(targetPath, pngBuffer)
    converted += 1
  }

  console.log(
    `[svg2png] Converted ${converted} SVG file(s) to ${options.size}x${options.size} PNG in ${outputAbs}`,
  )
}

await run()
