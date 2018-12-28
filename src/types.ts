import EventEmitter = NodeJS.EventEmitter

export type EmitterValue = {
  value: any,
  index: number,
  emitter: EventEmitter,
  emitterIndex: number,
  event: string
}

export type EmitterObserver = (...values: any[]) => void

export type EmitterObserverAll = (values: any[]) => void

export type EmitterObserverEx = (value: EmitterValue) => void

export type EmitterObserverAllEx = (values: EmitterValue[]) => void
