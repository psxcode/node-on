import { EmitterValue } from './types'
import EventEmitter = NodeJS.EventEmitter
import CallbackStorage from './callback-storage'

const onEx = (...events: string[]) =>
  (callback: (value: EmitterValue) => void) =>
    (...emitters: EventEmitter[]) => {
      const cbs = new CallbackStorage()

      /* subscribe */
      emitters.forEach((emitter, emitterIndex) =>
        events.forEach(event => {
          let i = 0
          const cb = (value: any) =>
            callback({ value, index: i++, emitterIndex, emitter, event })
          cbs.set(emitter, event, cb)
          emitter.addListener(event, cb)
        })
      )

      return () => {
        emitters.forEach(ee => {
          events.forEach(e => ee.removeListener(e, cbs.get(ee, e)!))
          cbs.delete(ee)
        })
      }
    }

export default onEx
