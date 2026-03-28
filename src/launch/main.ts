import '../styles/launchPage.css'
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
  if (value.toLowerCase().startsWith('ca')) {
    return 'ca'
  }
  return 'en'
}

const locale = normalizeLocale(navigator.language || 'en')
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

const renderLinks = (items: Array<{ href: string; label: string }>, emptyLabel: string): string => {
  if (items.length === 0) {
    return `<p class="launch-empty">${emptyLabel}</p>`
  }
  return items
    .map(
      (item) =>
        `<a class="launch-link" href="${item.href}" target="_blank" rel="noopener noreferrer">${item.label}</a>`,
    )
    .join('')
}

const root = document.getElementById('launch-root')
if (root) {
  root.innerHTML = `
    <section class="launch-shell">
      <header class="launch-head">
        <p class="launch-kicker">${copy.subtitle}</p>
        <h1>${copy.title}</h1>
        <p class="launch-position">${copy.position}</p>
      </header>

      <section class="launch-card">
        <h2>${copy.controlsTitle}</h2>
        <p>${copy.controlsKeyboard}</p>
        <p>${copy.controlsTouch}</p>
      </section>

      <section class="launch-card">
        <h2>${copy.supportTitle}</h2>
        <div class="launch-links">${renderLinks(supportLinks, 'Support links will be available soon.')}</div>
      </section>

      <section class="launch-card">
        <h2>${copy.platformsTitle}</h2>
        <div class="launch-links">${renderLinks(platformLinks, 'Platform links will be published at launch.')}</div>
      </section>

      <footer class="launch-footer">${copy.version} ${release.release_version} · ${release.release_channel} · ${release.build_id}</footer>
    </section>
  `
}
