import { EventEmitter } from 'events'
import { EmitterObserverEx } from './types'

const onEx = (...events: string[]) => (callback: EmitterObserverEx) => (...emitters: EventEmitter[]) => {
  const listener = (emitterIndex: number) => {
    let index = 0

    return (event: string) => (value: any) => {
      callback({
        value,
        index: index++,
        event,
        emitterIndex,
        emitter: emitters[emitterIndex],
      })
    }
  }
  const cbs = emitters.map((_, i) => {
    const l = listener(i)

    return events.reduce((res, e) => ((res[e] = l(e)), res), {} as { [key: string]: EmitterObserverEx })
  })
  const unsubscribe = () => {
    emitters.forEach((ee, i) => events.forEach((e) => ee.removeListener(e, cbs[i][e])))
  }

  /* subscribe */
  emitters.forEach((ee, i) => events.forEach((e) => ee.addListener(e, cbs[i][e])))

  return unsubscribe
}

export default onEx
