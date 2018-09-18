import EventEmitter = NodeJS.EventEmitter

export type EmitterValue = {
  value: any,
  index: number,
  emitter: EventEmitter,
  emitterIndex: number,
  event: string
}
