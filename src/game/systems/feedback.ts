import { getAudioProfileId } from './accessibility'

type FeedbackKind =
  | 'tap'
  | 'confirm'
  | 'success'
  | 'pickup'
  | 'reward'
  | 'danger'
  | 'pause'
  | 'crash'
  | 'portal'
  | 'urgent'

let audioContext: AudioContext | null = null
let audioUnlocked = false

const scaleVibrationPattern = (
  pattern: number | number[],
  multiplier: number,
): number | number[] => {
  if (multiplier === 1) {
    return pattern
  }
  if (Array.isArray(pattern)) {
    return pattern.map((value) => Math.max(1, Math.round(value * multiplier)))
  }
  return Math.max(1, Math.round(pattern * multiplier))
}

const resolveFeedbackProfile = (): {
  gainMultiplier: number
  vibrationMultiplier: number
  durationMultiplier: number
} => {
  const profile = getAudioProfileId()
  if (profile === 'focused') {
    return {
      gainMultiplier: 1.15,
      vibrationMultiplier: 1.12,
      durationMultiplier: 0.95,
    }
  }
  if (profile === 'low_fatigue') {
    return {
      gainMultiplier: 0.72,
      vibrationMultiplier: 0.65,
      durationMultiplier: 0.82,
    }
  }
  return {
    gainMultiplier: 1,
    vibrationMultiplier: 1,
    durationMultiplier: 1,
  }
}

const vibrationForKind = (kind: FeedbackKind): number | number[] => {
  if (kind === 'tap') return 8
  if (kind === 'confirm') return [10, 20, 10]
  if (kind === 'success') return [12, 18, 18]
  if (kind === 'pickup') return [8, 14, 12]
  if (kind === 'reward') return [10, 14, 18, 20, 20]
  if (kind === 'danger') return [25, 20, 25]
  if (kind === 'crash') return [35, 25, 35, 25, 50]
  if (kind === 'portal') return [16, 12, 24]
  if (kind === 'urgent') return 6
  return 10
}

const toneForKind = (kind: FeedbackKind): { freq: number; durationMs: number; gain: number } => {
  if (kind === 'tap') return { freq: 420, durationMs: 40, gain: 0.012 }
  if (kind === 'confirm') return { freq: 600, durationMs: 70, gain: 0.016 }
  if (kind === 'success') return { freq: 740, durationMs: 85, gain: 0.017 }
  if (kind === 'pickup') return { freq: 820, durationMs: 65, gain: 0.014 }
  if (kind === 'reward') return { freq: 920, durationMs: 150, gain: 0.018 }
  if (kind === 'danger') return { freq: 220, durationMs: 120, gain: 0.02 }
  if (kind === 'crash') return { freq: 130, durationMs: 190, gain: 0.028 }
  if (kind === 'portal') return { freq: 860, durationMs: 180, gain: 0.02 }
  if (kind === 'urgent') return { freq: 980, durationMs: 65, gain: 0.012 }
  return { freq: 360, durationMs: 60, gain: 0.013 }
}

const getAudioContext = (): AudioContext | null => {
  if (audioContext) return audioContext
  const AudioCtx =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return null
  audioContext = new AudioCtx()
  return audioContext
}

const unlockAudio = async (): Promise<boolean> => {
  const ctx = getAudioContext()
  if (!ctx) {
    return false
  }
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      return false
    }
  }
  audioUnlocked = ctx.state === 'running'
  return audioUnlocked
}

const playTone = (kind: FeedbackKind): void => {
  const ctx = getAudioContext()
  if (!ctx || !audioUnlocked) {
    return
  }

  const tone = toneForKind(kind)
  const profile = resolveFeedbackProfile()
  const durationMs = Math.max(20, Math.round(tone.durationMs * profile.durationMultiplier))
  const gain = tone.gain * profile.gainMultiplier
  const now = ctx.currentTime
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  oscillator.type =
    kind === 'crash' ? 'sawtooth' : kind === 'portal' || kind === 'reward' ? 'triangle' : 'square'
  oscillator.frequency.value = tone.freq
  if (kind === 'crash') {
    oscillator.frequency.exponentialRampToValueAtTime(85, now + durationMs / 1000)
  } else if (kind === 'portal') {
    oscillator.frequency.exponentialRampToValueAtTime(640, now + durationMs / 1000)
  } else if (kind === 'reward') {
    oscillator.frequency.exponentialRampToValueAtTime(1180, now + durationMs / 1000)
  }
  gainNode.gain.value = 0
  gainNode.gain.setValueAtTime(0, now)
  gainNode.gain.linearRampToValueAtTime(gain, now + 0.005)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000)
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + durationMs / 1000 + 0.01)
}

export const setupFeedback = (): void => {
  let cleaned = false
  const cleanup = (): void => {
    if (cleaned) {
      return
    }
    cleaned = true
    document.removeEventListener('touchstart', unlock)
    document.removeEventListener('pointerdown', unlock)
    document.removeEventListener('mousedown', unlock)
    document.removeEventListener('keydown', unlock)
  }
  const unlock = (): void => {
    void unlockAudio().then((ok) => {
      if (ok) {
        cleanup()
      }
    })
  }
  document.addEventListener('touchstart', unlock, { passive: true })
  document.addEventListener('pointerdown', unlock, { passive: true })
  document.addEventListener('mousedown', unlock, { passive: true })
  document.addEventListener('keydown', unlock)
}

export const emitFeedback = (kind: FeedbackKind): void => {
  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    const profile = resolveFeedbackProfile()
    navigator.vibrate(scaleVibrationPattern(vibrationForKind(kind), profile.vibrationMultiplier))
  }
  playTone(kind)
}
