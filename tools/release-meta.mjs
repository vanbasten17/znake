#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

const CHANNELS = new Set(['dev', 'stage', 'prod'])

const [command = 'print', inputChannel = 'dev', inputVersion, inputBuildId] = process.argv.slice(2)

const normalizeChannel = (value) => (CHANNELS.has(value) ? value : 'dev')
const channel = normalizeChannel(inputChannel)
const version = inputVersion || process.env.npm_package_version || '0.0.0'
const buildId = inputBuildId || new Date().toISOString().replaceAll(/[-:]/g, '').replace('.', '')

const metadata = {
  release_channel: channel,
  release_version: version,
  build_id: buildId,
  launch_links: {
    privacy_url: process.env.VITE_PRIVACY_POLICY_URL?.trim() || null,
    telemetry_url: process.env.VITE_TELEMETRY_DISCLOSURE_URL?.trim() || null,
    faq_url: process.env.VITE_FAQ_URL?.trim() || null,
    feedback_url: process.env.VITE_FEEDBACK_URL?.trim() || null,
    contact_url: process.env.VITE_CONTACT_URL?.trim() || null,
    support_url: process.env.VITE_SUPPORT_URL?.trim() || null,
    web_play_url: process.env.VITE_WEB_PLAY_URL?.trim() || null,
    ios_store_url: process.env.VITE_IOS_STORE_URL?.trim() || null,
    android_store_url: process.env.VITE_ANDROID_STORE_URL?.trim() || null,
  },
}

if (command === 'print') {
  console.log(JSON.stringify(metadata, null, 2))
  process.exit(0)
}

if (command === 'env') {
  console.log(`VITE_RELEASE_CHANNEL=${metadata.release_channel}`)
  console.log(`VITE_RELEASE_VERSION=${metadata.release_version}`)
  console.log(`VITE_BUILD_ID=${metadata.build_id}`)
  if (metadata.launch_links.privacy_url)
    console.log(`VITE_PRIVACY_POLICY_URL=${metadata.launch_links.privacy_url}`)
  if (metadata.launch_links.telemetry_url)
    console.log(`VITE_TELEMETRY_DISCLOSURE_URL=${metadata.launch_links.telemetry_url}`)
  if (metadata.launch_links.faq_url) console.log(`VITE_FAQ_URL=${metadata.launch_links.faq_url}`)
  if (metadata.launch_links.feedback_url)
    console.log(`VITE_FEEDBACK_URL=${metadata.launch_links.feedback_url}`)
  if (metadata.launch_links.contact_url)
    console.log(`VITE_CONTACT_URL=${metadata.launch_links.contact_url}`)
  if (metadata.launch_links.support_url)
    console.log(`VITE_SUPPORT_URL=${metadata.launch_links.support_url}`)
  if (metadata.launch_links.web_play_url)
    console.log(`VITE_WEB_PLAY_URL=${metadata.launch_links.web_play_url}`)
  if (metadata.launch_links.ios_store_url)
    console.log(`VITE_IOS_STORE_URL=${metadata.launch_links.ios_store_url}`)
  if (metadata.launch_links.android_store_url)
    console.log(`VITE_ANDROID_STORE_URL=${metadata.launch_links.android_store_url}`)
  process.exit(0)
}

if (command === 'validate') {
  const required = [
    ['VITE_PRIVACY_POLICY_URL', metadata.launch_links.privacy_url],
    ['VITE_SUPPORT_URL', metadata.launch_links.support_url],
    ['VITE_FEEDBACK_URL', metadata.launch_links.feedback_url],
    ['VITE_CONTACT_URL', metadata.launch_links.contact_url],
    ['VITE_WEB_PLAY_URL', metadata.launch_links.web_play_url],
  ]
  const missing = required.filter(([, value]) => !value).map(([key]) => key)
  if (missing.length > 0) {
    console.error('[release-meta] Missing required launch link env vars:')
    for (const key of missing) {
      console.error(`- ${key}`)
    }
    console.error('Set these env vars and rerun: pnpm release:meta:validate')
    process.exit(1)
  }
  console.log('[release-meta] Launch link metadata valid.')
  process.exit(0)
}

if (command === 'build') {
  const env = {
    ...process.env,
    VITE_RELEASE_CHANNEL: metadata.release_channel,
    VITE_RELEASE_VERSION: metadata.release_version,
    VITE_BUILD_ID: metadata.build_id,
  }
  console.log(
    `[release-build] channel=${metadata.release_channel} version=${metadata.release_version} build_id=${metadata.build_id}`,
  )
  const result = spawnSync('pnpm', ['build'], { stdio: 'inherit', env })
  process.exit(result.status ?? 1)
}

console.error('Unknown command. Use one of: print | env | validate | build')
process.exit(1)
