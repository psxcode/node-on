import EventEmitter = NodeJS.EventEmitter
import { EmitterObserverAll } from './types'

const onceAll = (...events: string[]) =>
  (cb: EmitterObserverAll) =>
    (...emitters: EventEmitter[]) => {
      const values = new Array(emitters.length)
      let numDone = 0
      const listener = (index: number): EmitterObserverAll =>
        function impl (value: any) {
          values[index] = value
          ++numDone === events.length && cb(values)
        }
      const cbs: EmitterObserverAll[] = emitters.map((_, i) => listener(i))

      /* subscribe */
      emitters.forEach((ee, ii) => events.forEach(e => ee.once(e, cbs[ii])))

      return () => {
        emitters.forEach((ee, ii) => events.forEach(e => ee.removeListener(e, cbs[ii])))
      }
    }

export default onceAll
