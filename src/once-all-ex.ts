import EventEmitter = NodeJS.EventEmitter
import { EmitterObserverAllEx, EmitterValue } from './types'

const onceAllEx = (...events: string[]) =>
  (cb: EmitterObserverAllEx) =>
    (...emitters: EventEmitter[]) => {
      const values: EmitterValue[] = new Array(emitters.length)
      let numDone = 0
      const listener = (event: string, emitterIndex: number): EmitterObserverAllEx => (value: any) => {
        values[emitterIndex] = {
          value,
          index: 0,
          event,
          emitterIndex,
          emitter: emitters[emitterIndex]
        }
        ++numDone === events.length && cb(values)
      }
      const cbs = emitters.map((_, i) => events.reduce(
        (res, e) => (res[e] = listener(e, i), res),
        {} as { [key: string]: EmitterObserverAllEx }
      ))

      /* subscribe */
      emitters.forEach((ee, i) => events.forEach(e => ee.once(e, cbs[i][e])))

      return () => {
        emitters.forEach((ee, i) => events.forEach(e => ee.removeListener(e, cbs[i][e])))
      }
    }

export default onceAllEx
