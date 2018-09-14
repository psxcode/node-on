import EventEmitter = NodeJS.EventEmitter
import { EmitterValue } from './types'

const onceRaceEx = (...events: string[]) =>
  (cb: (value: EmitterValue) => void) =>
    (...emitters: EventEmitter[]) => {
      const cbs = new WeakMap<EventEmitter, any>(
        emitters.map((emitter, i) => [
          emitter,
          (value: any) => {
            unsubscribe()
            cb({ value, emitter, emitterIndex: i })
          }
        ] as [EventEmitter, any])
      )

      function unsubscribe () {
        emitters.forEach(ee => events.forEach(e => ee.removeListener(e, cbs.get(ee))))
      }

      /* subscribe */
      emitters.forEach(ee => events.forEach(e => ee.addListener(e, cbs.get(ee))))
      return unsubscribe
    }

export default onceRaceEx
