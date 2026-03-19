import { getAccessibilitySettings } from './accessibility'
import { emitFeedback } from './feedback'

type SpeechResultLike = {
  0?: { transcript?: string }
}

type SpeechEventLike = {
  resultIndex?: number
  results: ArrayLike<SpeechResultLike>
}

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechEventLike) => void) | null
  onerror: ((event: { error?: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechCtor = new () => SpeechRecognitionLike
type VoiceAvailability = 'supported' | 'unsupported'
type VoiceCommand = 'up' | 'down' | 'left' | 'right' | 'pause' | 'start'

declare global {
  interface Window {
    SpeechRecognition?: SpeechCtor
    webkitSpeechRecognition?: SpeechCtor
  }
}

const commandMap: Record<string, VoiceCommand> = {
  up: 'up',
  moveup: 'up',
  goup: 'up',
  arriba: 'up',
  amunt: 'up',
  dalt: 'up',
  down: 'down',
  movedown: 'down',
  godown: 'down',
  abajo: 'down',
  avall: 'down',
  baix: 'down',
  left: 'left',
  moveleft: 'left',
  goleft: 'left',
  izquierda: 'left',
  esquerre: 'left',
  esquerra: 'left',
  right: 'right',
  moveright: 'right',
  goright: 'right',
  derecha: 'right',
  dreta: 'right',
  pause: 'pause',
  pausar: 'pause',
  pausa: 'pause',
  start: 'start',
  begin: 'start',
  resume: 'start',
  continuar: 'start',
  inici: 'start',
}

const resolveCtor = (): SpeechCtor | null =>
  window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null

const availability: VoiceAvailability = resolveCtor() ? 'supported' : 'unsupported'

let initialized = false
let enabled = false
let recognition: SpeechRecognitionLike | null = null
let lastVoiceCommandAt = 0
let lastProcessedTranscript = ''
let lastProcessedTranscriptAt = 0
const VOICE_COMMAND_COOLDOWN_MS = 90
const SAME_TRANSCRIPT_REPEAT_MS = 320

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .replaceAll(/[^a-z0-9\s]/g, ' ')
    .trim()

const collapseWords = (words: string[]): string[] => {
  const collapsed: string[] = []
  for (let index = 0; index < words.length; index += 1) {
    const one = words[index]
    const two = one && words[index + 1] ? `${one}${words[index + 1]}` : null
    const three = two && words[index + 2] ? `${two}${words[index + 2]}` : null
    if (three) {
      collapsed.push(three)
    }
    if (two) {
      collapsed.push(two)
    }
    if (one) {
      collapsed.push(one)
    }
  }
  return collapsed
}

const toCommand = (transcript: string): VoiceCommand | null => {
  const words = normalize(transcript).split(/\s+/).filter(Boolean)

  // Fast-path for low-latency single-word commands.
  for (let index = words.length - 1; index >= 0; index -= 1) {
    const word = words[index]
    if (word && commandMap[word]) {
      return commandMap[word]
    }
  }

  const collapsed = collapseWords(words)
  for (let index = collapsed.length - 1; index >= 0; index -= 1) {
    const word = collapsed[index]
    if (word && commandMap[word]) {
      return commandMap[word]
    }
  }
  return null
}

const publishCommand = (command: NonNullable<ReturnType<typeof toCommand>>): void => {
  if (command === 'pause') {
    window.virtualInput.pause = true
    emitFeedback('tap')
    return
  }
  if (command === 'start') {
    window.virtualInput.start = true
    emitFeedback('tap')
    return
  }
  window.virtualInput.dir = command
  emitFeedback('tap')
}

const stopRecognition = (): void => {
  if (!recognition) {
    return
  }
  try {
    recognition.onend = null
    recognition.onresult = null
    recognition.onerror = null
    recognition.stop()
  } catch {
    // no-op
  }
  recognition = null
}

const startRecognition = (): void => {
  if (!enabled || availability !== 'supported' || recognition) {
    return
  }
  const SpeechRecognitionCtor = resolveCtor()
  if (!SpeechRecognitionCtor) {
    return
  }

  const instance = new SpeechRecognitionCtor()
  instance.lang = document.documentElement.lang === 'ca' ? 'ca-ES' : 'en-US'
  instance.continuous = true
  instance.interimResults = true
  instance.maxAlternatives = 1

  instance.onresult = (event: SpeechEventLike): void => {
    const now = performance.now()
    if (now - lastVoiceCommandAt < VOICE_COMMAND_COOLDOWN_MS) {
      return
    }

    const startIndex = Math.max(0, event.resultIndex ?? event.results.length - 1)
    for (let index = event.results.length - 1; index >= startIndex; index -= 1) {
      const result = event.results[index]
      const transcript = result?.[0]?.transcript
      if (!transcript) {
        continue
      }
      const normalizedTranscript = normalize(transcript)
      if (
        !normalizedTranscript ||
        (normalizedTranscript === lastProcessedTranscript &&
          now - lastProcessedTranscriptAt < SAME_TRANSCRIPT_REPEAT_MS)
      ) {
        continue
      }
      const command = toCommand(transcript)
      if (command) {
        lastProcessedTranscript = normalizedTranscript
        lastProcessedTranscriptAt = now
        lastVoiceCommandAt = now
        publishCommand(command)
        return
      }
    }
  }

  instance.onerror = (event): void => {
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      enabled = false
      stopRecognition()
      return
    }
    stopRecognition()
    if (enabled && document.visibilityState === 'visible') {
      window.setTimeout(startRecognition, 450)
    }
  }

  instance.onend = (): void => {
    recognition = null
    if (enabled && document.visibilityState === 'visible') {
      window.setTimeout(startRecognition, 250)
    }
  }

  recognition = instance
  try {
    recognition.start()
  } catch {
    recognition = null
  }
}

const syncFromSettings = (): void => {
  const settings = getAccessibilitySettings()
  enabled = settings.voiceEnabled && availability === 'supported'
  if (enabled) {
    startRecognition()
    return
  }
  stopRecognition()
}

export const setupVoiceInput = (): void => {
  if (initialized) {
    return
  }
  initialized = true
  syncFromSettings()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
      stopRecognition()
      return
    }
    if (enabled) {
      startRecognition()
    }
  })
}

export const syncVoiceInput = (): void => {
  syncFromSettings()
}

export const getVoiceAvailability = (): VoiceAvailability => availability
