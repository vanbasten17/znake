import '../styles/launchPage.css'
import { applyElementAttrs } from '../game/systems/domFactory'
import { getReleaseDisclosureLinks, getReleaseMetadata } from '../game/systems/release'

type LaunchLocale = 'en' | 'ca'

type LaunchCopy = {
  title: string
  subtitle: string
  position: string
  controlsTitle: string
  controlsKeyboard: string
  controlsTouch: string
  supportTitle: string
  platformsTitle: string
  links: {
    privacy: string
    support: string
    faq: string
    feedback: string
    contact: string
    webPlay: string
    iosStore: string
    androidStore: string
  }
  version: string
}

const copyByLocale: Record<LaunchLocale, LaunchCopy> = {
  en: {
    title: 'ZNAKE',
    subtitle: 'Roguelite Snake, tuned for quick mastery loops.',
    position:
      'Survive pressure, route smart, and stack deterministic upgrades in high-clarity runs.',
    controlsTitle: 'Controls',
    controlsKeyboard: 'Keyboard: Arrow keys / WASD to move, Space to pause, Enter to start/select.',
    controlsTouch: 'Touch: Swipe to move, tap prompts to confirm picks and continue.',
    supportTitle: 'Support',
    platformsTitle: 'Play Platforms',
    links: {
      privacy: 'Privacy',
      support: 'Support',
      faq: 'FAQ',
      feedback: 'Feedback',
      contact: 'Contact',
      webPlay: 'Play on Web',
      iosStore: 'App Store',
      androidStore: 'Google Play',
    },
    version: 'Build',
  },
  ca: {
    title: 'ZNAKE',
    subtitle: 'Snake roguelite, ajustat per a partides curtes i dominables.',
    position:
      'Sobreviu la pressio, tria rutes amb cap i combina millores deterministes en partides clares.',
    controlsTitle: 'Controls',
    controlsKeyboard:
      'Teclat: fletxes / WASD per moure, espai per pausa, Enter per iniciar o confirmar.',
    controlsTouch: 'Tactil: llisca per moure, toca les opcions per confirmar i continuar.',
    supportTitle: 'Suport',
    platformsTitle: 'Plataformes',
    links: {
      privacy: 'Privacitat',
      support: 'Suport',
      faq: 'PMF',
      feedback: 'Feedback',
      contact: 'Contacte',
      webPlay: 'Juga al web',
      iosStore: 'App Store',
      androidStore: 'Google Play',
    },
    version: 'Build',
  },
}

const normalizeLocale = (value: string): LaunchLocale => {
  const lowered = value.toLowerCase().trim()
  if (lowered.startsWith('ca')) {
    return 'ca'
  }
  return 'en'
}

const resolvePreferredLocale = (preferred: string[]): LaunchLocale => {
  for (const locale of preferred) {
    const normalized = normalizeLocale(locale)
    if (normalized in copyByLocale) {
      return normalized
    }
  }
  return 'en'
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const renderLinks = (items: Array<{ href: string; label: string }>, emptyLabel: string): string => {
  if (items.length === 0) {
    return `<p class="launch-empty">${escapeHtml(emptyLabel)}</p>`
  }
  return items
    .map((item) => {
      const href = escapeHtml(item.href)
      const label = escapeHtml(item.label)
      return `<a class="launch-link" href="${href}" target="_blank" rel="noopener noreferrer external">${label}</a>`
    })
    .join('')
}

const locale = resolvePreferredLocale(
  (Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || 'en']) as string[],
)
const copy = copyByLocale[locale]

const release = getReleaseMetadata()
const links = getReleaseDisclosureLinks()

const supportLinks = [
  { href: links.privacyUrl, label: copy.links.privacy },
  { href: links.supportUrl, label: copy.links.support },
  { href: links.faqUrl, label: copy.links.faq },
  { href: links.feedbackUrl, label: copy.links.feedback },
  { href: links.contactUrl, label: copy.links.contact },
].filter((item): item is { href: string; label: string } => Boolean(item.href))

const platformLinks = [
  { href: links.webPlayUrl, label: copy.links.webPlay },
  { href: links.iosStoreUrl, label: copy.links.iosStore },
  { href: links.androidStoreUrl, label: copy.links.androidStore },
].filter((item): item is { href: string; label: string } => Boolean(item.href))

const root = document.getElementById('launch-root')
if (root) {
  applyElementAttrs(root, {
    role: 'main',
    'aria-live': 'polite',
    'aria-label': 'Znake launch page',
  })
  root.innerHTML = `
    <section class="launch-shell" aria-label="${escapeHtml(copy.title)}">
      <header class="launch-head" aria-labelledby="launch-title">
        <p class="launch-kicker">${escapeHtml(copy.subtitle)}</p>
        <h1 id="launch-title">${escapeHtml(copy.title)}</h1>
        <p class="launch-position">${escapeHtml(copy.position)}</p>
      </header>

      <section class="launch-card" aria-labelledby="launch-controls-title">
        <h2 id="launch-controls-title">${escapeHtml(copy.controlsTitle)}</h2>
        <p>${escapeHtml(copy.controlsKeyboard)}</p>
        <p>${escapeHtml(copy.controlsTouch)}</p>
      </section>

      <section class="launch-card" aria-labelledby="launch-support-title">
        <h2 id="launch-support-title">${escapeHtml(copy.supportTitle)}</h2>
        <div class="launch-links">${renderLinks(supportLinks, 'Support links will be available soon.')}</div>
      </section>

      <section class="launch-card" aria-labelledby="launch-platforms-title">
        <h2 id="launch-platforms-title">${escapeHtml(copy.platformsTitle)}</h2>
        <div class="launch-links">${renderLinks(platformLinks, 'Platform links will be published at launch.')}</div>
      </section>

      <footer class="launch-footer">${escapeHtml(copy.version)} ${escapeHtml(release.release_version)} · ${escapeHtml(release.release_channel)} · ${escapeHtml(release.build_id)}</footer>
    </section>
  `
}
