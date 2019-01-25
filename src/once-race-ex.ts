import { EventEmitter } from 'events'
import { EmitterObserverEx } from './types'

export const onceRaceEx = (...events: string[]) => (callback: EmitterObserverEx) => (...emitters: EventEmitter[]) => {
  const listener = (event: string, emitterIndex: number): EmitterObserverEx => (value: any) => {
    unsubscribe()

    return callback({
      value,
      index: 0,
      event,
      emitterIndex,
      emitter: emitters[emitterIndex],
    })
  }
  const cbs = emitters.map((_, i) => events.reduce(
    (res, e) => ((res[e] = listener(e, i)), res),
    {} as { [key: string]: EmitterObserverEx }
  ))
  const unsubscribe = () => {
    emitters.forEach((ee, i) => events.forEach((e) => ee.removeListener(e, cbs[i][e])))
  }

  /* subscribe */
  emitters.forEach((ee, i) => events.forEach((e) => ee.addListener(e, cbs[i][e])))

  return unsubscribe
}

export default onceRaceEx
