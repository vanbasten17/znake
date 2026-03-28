export type DomainEventListener<TEvent> = (event: TEvent, sequence: number) => void

export type DomainEventBus<TEvent> = {
  publish: (event: TEvent) => number
  subscribe: (listener: DomainEventListener<TEvent>) => () => void
}

export const createDomainEventBus = <TEvent>(): DomainEventBus<TEvent> => {
  let sequence = 0
  const listeners = new Set<DomainEventListener<TEvent>>()

  return {
    publish: (event) => {
      const current = sequence
      sequence += 1
      for (const listener of listeners) {
        listener(event, current)
      }
      return current
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
