type EventPayload = Record<string, number | string | boolean | null>

type RetentionEvent = {
  name: string
  payload: EventPayload
  ts: string
}

import { getReleaseMetadata } from './release'

const retentionEvents: RetentionEvent[] = []

export const trackRetentionEvent = (name: string, payload: EventPayload = {}): void => {
  const basePayload = getReleaseMetadata()
  const event: RetentionEvent = {
    name,
    payload: { ...basePayload, ...payload },
    ts: new Date().toISOString(),
  }
  retentionEvents.push(event)
  if (retentionEvents.length > 100) {
    retentionEvents.shift()
  }
  console.info('[retention-event]', event)
}

export const getRetentionEvents = (): RetentionEvent[] => [...retentionEvents]

const getErrorName = (value: unknown): string =>
  value instanceof Error ? value.name : typeof value === 'string' ? 'Error' : 'UnknownError'

const getErrorMessage = (value: unknown): string => {
  if (value instanceof Error) return value.message
  if (typeof value === 'string') return value
  return 'unknown runtime error'
}

const getErrorStack = (value: unknown): string | null => {
  if (!(value instanceof Error)) return null
  if (!value.stack) return null
  return value.stack.slice(0, 1000)
}

const emitRuntimeError = (
  source: 'error' | 'unhandledrejection',
  value: unknown,
  extra: EventPayload = {},
): void => {
  trackRetentionEvent('runtime_error', {
    error_source: source,
    error_name: getErrorName(value),
    error_message: getErrorMessage(value),
    error_stack: getErrorStack(value),
    ...extra,
  })
}

let runtimeErrorCaptureInstalled = false

export const setupRuntimeErrorCapture = (): void => {
  if (runtimeErrorCaptureInstalled) return
  runtimeErrorCaptureInstalled = true

  window.addEventListener('error', (event) => {
    try {
      const location = [event.filename, event.lineno, event.colno]
        .filter((part) => part !== undefined && part !== null && part !== '')
        .join(':')
      emitRuntimeError('error', event.error ?? event.message, {
        error_location: location || null,
      })
    } catch {
      // Keep runtime error capture best-effort and non-blocking.
    }
  })

  window.addEventListener('unhandledrejection', (event) => {
    try {
      emitRuntimeError('unhandledrejection', event.reason)
    } catch {
      // Keep runtime error capture best-effort and non-blocking.
    }
  })
}
