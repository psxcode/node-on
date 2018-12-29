import { EventEmitter } from 'events'
import { EmitterObserverAll } from './types'

const onceAll = (...events: string[]) => (cb: EmitterObserverAll) => (...emitters: EventEmitter[]) => {
  const values = new Array(emitters.length)
  const done: boolean[] = new Array(emitters.length)
  let numDone = 0
  const listener = (emitterIndex: number): EmitterObserverAll => (value: any) => {
    if (done[emitterIndex]) {
      return
    }

    values[emitterIndex] = value
    done[emitterIndex] = true

    if (++numDone === emitters.length) {
      unsubscribe()
      cb(values)
    }
  }
  const cbs: EmitterObserverAll[] = emitters.map((_, i) => listener(i))
  const unsubscribe = () => {
    emitters.forEach((ee, ii) => events.forEach((e) => ee.removeListener(e, cbs[ii])))
  }

  /* subscribe */
  emitters.forEach((ee, ii) => events.forEach((e) => ee.once(e, cbs[ii])))

  return unsubscribe
}

export default onceAll
