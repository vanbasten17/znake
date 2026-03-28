export type ReleaseMetadata = {
  release_version: string
  release_channel: ReleaseChannel
  build_id: string
}

export type ReleaseChannel = 'dev' | 'stage' | 'prod'

type ReleaseDisclosureLinks = {
  privacyUrl: string | null
  telemetryUrl: string | null
  faqUrl: string | null
  feedbackUrl: string | null
  contactUrl: string | null
  supportUrl: string | null
  webPlayUrl: string | null
  iosStoreUrl: string | null
  androidStoreUrl: string | null
}

const readEnv = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const RELEASE_CHANNELS = ['dev', 'stage', 'prod'] as const

const isReleaseChannel = (value: string): value is ReleaseChannel =>
  RELEASE_CHANNELS.includes(value as ReleaseChannel)

const readReleaseChannel = (): ReleaseChannel => {
  const channel = readEnv(import.meta.env.VITE_RELEASE_CHANNEL)
  if (!channel) {
    return 'dev'
  }
  return isReleaseChannel(channel) ? channel : 'dev'
}

const releaseMetadata: ReleaseMetadata = Object.freeze({
  release_version: readEnv(import.meta.env.VITE_RELEASE_VERSION) ?? 'dev-local',
  release_channel: readReleaseChannel(),
  build_id: readEnv(import.meta.env.VITE_BUILD_ID) ?? 'local',
})

const disclosureLinks: ReleaseDisclosureLinks = Object.freeze({
  privacyUrl: readEnv(import.meta.env.VITE_PRIVACY_POLICY_URL),
  telemetryUrl: readEnv(import.meta.env.VITE_TELEMETRY_DISCLOSURE_URL),
  faqUrl: readEnv(import.meta.env.VITE_FAQ_URL),
  feedbackUrl: readEnv(import.meta.env.VITE_FEEDBACK_URL),
  contactUrl: readEnv(import.meta.env.VITE_CONTACT_URL),
  supportUrl: readEnv(import.meta.env.VITE_SUPPORT_URL),
  webPlayUrl: readEnv(import.meta.env.VITE_WEB_PLAY_URL),
  iosStoreUrl: readEnv(import.meta.env.VITE_IOS_STORE_URL),
  androidStoreUrl: readEnv(import.meta.env.VITE_ANDROID_STORE_URL),
})

export const getReleaseMetadata = (): ReleaseMetadata => releaseMetadata

export const getReleaseDisclosureLinks = (): ReleaseDisclosureLinks => disclosureLinks

export const getReleaseChannels = (): readonly ReleaseChannel[] => RELEASE_CHANNELS
