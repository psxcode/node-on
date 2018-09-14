import EventEmitter = NodeJS.EventEmitter

export type EmitterValue = {
  value: any
  emitter: EventEmitter
  emitterIndex: number
}
