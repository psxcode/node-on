import { EmitterObserverEx } from './types'
import EventEmitter = NodeJS.EventEmitter

const onEx = (...events: string[]) =>
  (callback: EmitterObserverEx) =>
    (...emitters: EventEmitter[]) => {
      const listener = (event: string, emitterIndex: number): EmitterObserverEx => {
        let index = 0
        return (value: any) => {
          callback({
            value,
            index: index++,
            event,
            emitterIndex,
            emitter: emitters[emitterIndex]
          })
        }
      }
      const cbs = emitters.map((_, i) => events.reduce(
        (res, e) => (res[e] = listener(e, i), res),
        {} as { [key: string]: EmitterObserverEx }
      ))

      /* subscribe */
      emitters.forEach((ee, i) => events.forEach(e => ee.addListener(e, cbs[i][e])))

      return () => {
        emitters.forEach((ee, i) => events.forEach(e => ee.removeListener(e, cbs[i][e])))
      }
    }

export default onEx
