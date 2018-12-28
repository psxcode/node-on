import EventEmitter = NodeJS.EventEmitter
import { EmitterObserver } from './types'

const onceRace = (...events: string[]) =>
  (cb: EmitterObserver) =>
    (...emitters: EventEmitter[]) => {
      const onData = (...values: any[]) => {
        unsubscribe()
        cb(...values)
      }

      function unsubscribe () {
        emitters.forEach(ee => events.forEach(e => ee.removeListener(e, onData)))
      }

      /* subscribe */
      emitters.forEach(ee => events.forEach(e => ee.addListener(e, onData)))
      return unsubscribe
    }

export default onceRace
