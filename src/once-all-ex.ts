import { EventEmitter } from 'events'
import { EmitterObserverAllEx, EmitterValue } from './types'

const onceAllEx = (...events: string[]) => (cb: EmitterObserverAllEx) => (...emitters: EventEmitter[]) => {
  const values: EmitterValue[] = new Array(emitters.length)
  const done: boolean[] = new Array(emitters.length)
  let numDone = 0
  const listener = (event: string, emitterIndex: number): EmitterObserverAllEx => (value: any) => {
    if (done[emitterIndex]) {
      return
    }

    values[emitterIndex] = {
      value,
      index: 0,
      event,
      emitterIndex,
      emitter: emitters[emitterIndex]
    }
    done[emitterIndex] = true

    if (++numDone === emitters.length) {
      unsubscribe()
      cb(values)
    }
  }
  const cbs = emitters.map((_, i) =>
    events.reduce((res, e) => ((res[e] = listener(e, i)), res), {} as { [key: string]: EmitterObserverAllEx })
  )
  const unsubscribe = () => {
    emitters.forEach((ee, i) => events.forEach((e) => ee.removeListener(e, cbs[i][e])))
  }

  /* subscribe */
  emitters.forEach((ee, i) => events.forEach((e) => ee.once(e, cbs[i][e])))

  return unsubscribe
}

export default onceAllEx
