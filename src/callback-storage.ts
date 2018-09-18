import EventEmitter = NodeJS.EventEmitter

class CallbackStorage {
  cbs = new WeakMap()

  has (emitter: EventEmitter, event?: string): boolean {
    return this.cbs.has(emitter) && (event ? !!this.get(emitter, event) : true)
  }

  set (emitter: EventEmitter, event: string, cb: (value: any) => void) {
    const fns = this.cbs.get(emitter) || Object.create(null)
    fns[event] = cb
    this.cbs.set(emitter, fns)
  }

  get (emitter: EventEmitter, event: string): ((value: any) => void) | undefined {
    const fns = this.cbs.get(emitter)
    return fns && fns[event]
  }

  delete (emitter: EventEmitter) {
    this.cbs.delete(emitter)
  }
}

export default CallbackStorage
