/**
 * Loads `assets/sprites/generated/marker_<tone>.png` for every glossary tone (Vite `?url`).
 * When a PNG loads, `drawMarkerSpriteCanvas` (see `markerBitmapDraw.ts`) uses it instead of procedural art.
 */
import { GLOSSARY_MARKER_TONES, type GlossaryMarkerTone } from '../core/glossary'

const urlModules = import.meta.glob('../../../assets/sprites/generated/marker_*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const neonPreviewModules = import.meta.glob(
  '../../../assets/sprites/source/marker_neon_proposals/png/marker_*_neon.png',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
) as Record<string, string>

const urlByTone = (): Partial<Record<GlossaryMarkerTone, string>> => {
  const out: Partial<Record<GlossaryMarkerTone, string>> = {}
  for (const [path, url] of Object.entries(urlModules)) {
    const match = /marker_(\w+)\.png$/.exec(path)
    if (!match) continue
    const tone = match[1] as GlossaryMarkerTone
    if (GLOSSARY_MARKER_TONES.includes(tone)) {
      out[tone] = url
    }
  }
  return out
}

const neonUrlByTone = (): Partial<Record<GlossaryMarkerTone, string>> => {
  const out: Partial<Record<GlossaryMarkerTone, string>> = {}
  for (const [path, url] of Object.entries(neonPreviewModules)) {
    const match = /marker_(\w+)_neon\.png$/.exec(path)
    if (!match) continue
    const tone = match[1] as GlossaryMarkerTone
    if (GLOSSARY_MARKER_TONES.includes(tone)) {
      out[tone] = url
    }
  }
  return out
}

const isNeonPreviewEnabled = (): boolean => {
  const params = new URLSearchParams(window.location.search)
  return params.get('neonPreview') === '1'
}

const baseUrls = urlByTone()
const neonUrls = neonUrlByTone()
const TONE_URLS: Partial<Record<GlossaryMarkerTone, string>> = isNeonPreviewEnabled()
  ? { ...baseUrls, ...neonUrls }
  : baseUrls

const cache = new Map<GlossaryMarkerTone, HTMLImageElement | null>()
let loadPromise: Promise<void> | null = null

/**
 * Loads all marker PNGs in parallel (failed loads fall back to procedural drawing for that tone).
 */
export async function ensureMarkerBitmapsLoaded(): Promise<void> {
  if (loadPromise) {
    await loadPromise
    return
  }
  loadPromise = Promise.all(
    GLOSSARY_MARKER_TONES.map((tone) => {
      const url = TONE_URLS[tone]
      if (!url) {
        cache.set(tone, null)
        return Promise.resolve()
      }
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = (): void => {
          cache.set(tone, img)
          resolve()
        }
        img.onerror = (): void => {
          cache.set(tone, null)
          resolve()
        }
        img.src = url
      })
    }),
  ).then(() => {})
  await loadPromise
}

export function getMarkerBitmap(tone: GlossaryMarkerTone): HTMLImageElement | null {
  const img = cache.get(tone)
  if (img?.complete && img.naturalWidth > 0) {
    return img
  }
  return null
}
