type FeedbackKind =
  | 'tap'
  | 'confirm'
  | 'success'
  | 'danger'
  | 'pause'
  | 'crash'
  | 'portal'
  | 'urgent'

let audioContext: AudioContext | null = null
let audioUnlocked = false

const vibrationForKind = (kind: FeedbackKind): number | number[] => {
  if (kind === 'tap') return 8
  if (kind === 'confirm') return [10, 20, 10]
  if (kind === 'success') return [12, 18, 18]
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

const unlockAudio = (): void => {
  const ctx = getAudioContext()
  if (!ctx) {
    return
  }
  if (ctx.state === 'suspended') {
    void ctx.resume().then(() => {
      audioUnlocked = true
    })
    return
  }
  audioUnlocked = true
}

const playTone = (kind: FeedbackKind): void => {
  const ctx = getAudioContext()
  if (!ctx || !audioUnlocked) {
    return
  }

  const tone = toneForKind(kind)
  const now = ctx.currentTime
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  oscillator.type = kind === 'crash' ? 'sawtooth' : kind === 'portal' ? 'triangle' : 'square'
  oscillator.frequency.value = tone.freq
  if (kind === 'crash') {
    oscillator.frequency.exponentialRampToValueAtTime(85, now + tone.durationMs / 1000)
  } else if (kind === 'portal') {
    oscillator.frequency.exponentialRampToValueAtTime(640, now + tone.durationMs / 1000)
  }
  gainNode.gain.value = 0
  gainNode.gain.setValueAtTime(0, now)
  gainNode.gain.linearRampToValueAtTime(tone.gain, now + 0.005)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + tone.durationMs / 1000)
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + tone.durationMs / 1000 + 0.01)
}

export const setupFeedback = (): void => {
  const unlock = (): void => unlockAudio()
  document.addEventListener('pointerdown', unlock, { passive: true })
  document.addEventListener('keydown', unlock, { passive: true })
}

export const emitFeedback = (kind: FeedbackKind): void => {
  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    navigator.vibrate(vibrationForKind(kind))
  }
  playTone(kind)
}
