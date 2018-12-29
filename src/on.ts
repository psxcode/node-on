import { EventEmitter } from 'events'
import { EmitterObserver } from './types'

const on = (...events: string[]) => (cb: EmitterObserver) => (...emitters: EventEmitter[]) => {
  /* subscribe */
  emitters.forEach((ee) => events.forEach((e) => ee.addListener(e, cb)))

  return () => {
    emitters.forEach((ee) => events.forEach((e) => ee.removeListener(e, cb)))
  }
}

export default on
