import EventEmitter = NodeJS.EventEmitter
import { EmitterValue } from './types'
import CallbackStorage from './callback-storage'

const onceRaceEx = (...events: string[]) =>
  (callback: (value: EmitterValue) => void) =>
    (...emitters: EventEmitter[]) => {
      const cbs = new CallbackStorage()

      function unsubscribe () {
        emitters.forEach(ee => {
          events.forEach(e => cbs.has(ee, e) && ee.removeListener(e, cbs.get(ee, e)!))
          cbs.delete(ee)
        })
      }

      /* subscribe */
      emitters.forEach((emitter, emitterIndex) =>
        events.forEach(event => {
          let i = 0
          const cb = (value: any) => {
            unsubscribe()
            callback({ value, index: i++, emitterIndex, emitter, event })
          }
          cbs.set(emitter, event, cb)
          emitter.addListener(event, cb)
        })
      )

      return unsubscribe
    }

export default onceRaceEx
