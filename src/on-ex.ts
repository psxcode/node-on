import { EmitterValue } from './types'
import EventEmitter = NodeJS.EventEmitter

const onEx = (...events: string[]) =>
  (cb: (value: EmitterValue) => void) =>
    (...emitters: EventEmitter[]) => {
      const cbs = new WeakMap<EventEmitter, (arg: any) => void>(
        emitters.map((emitter, i) => [
          emitter,
          (value: any) => cb({ value, emitter, emitterIndex: i })
        ] as [EventEmitter, (arg: any) => void])
      )
      /* subscribe */
      emitters.forEach(ee => events.forEach(e => ee.addListener(e, cbs.get(ee)!)))
      return () => {
        emitters.forEach(ee => events.forEach(e => ee.removeListener(e, cbs.get(ee)!)))
      }
    }

export default onEx
