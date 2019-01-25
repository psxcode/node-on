import { EventEmitter } from 'events'
import { EmitterObserver } from './types'

const onceRace = (...events: string[]) => (cb: EmitterObserver) => (...emitters: EventEmitter[]) => {
  const onData = (...values: any[]) => {
    unsubscribe()
    cb(...values)
  }
  const unsubscribe = () => {
    emitters.forEach((ee) => events.forEach((e) => ee.removeListener(e, onData)))
  }

  /* subscribe */
  emitters.forEach((ee) => events.forEach((e) => ee.addListener(e, onData)))

  return unsubscribe
}

export default onceRace
