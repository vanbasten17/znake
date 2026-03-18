type EventPayload = Record<string, number | string | boolean | null>

type RetentionEvent = {
  name: string
  payload: EventPayload
  ts: string
}

const retentionEvents: RetentionEvent[] = []

export const trackRetentionEvent = (name: string, payload: EventPayload = {}): void => {
  const event: RetentionEvent = {
    name,
    payload,
    ts: new Date().toISOString(),
  }
  retentionEvents.push(event)
  if (retentionEvents.length > 100) {
    retentionEvents.shift()
  }
  console.info('[retention-event]', event)
}

export const getRetentionEvents = (): RetentionEvent[] => [...retentionEvents]
