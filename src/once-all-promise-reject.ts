import { EventEmitter } from 'events'
import onceAll from './once-all'
import onceRace from './once-race'

const onceAllPromiseReject = (rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve, reject) => {
    const unsubResolve = onceAll(...resolveEvents)((values) => {
      unsubReject()
      resolve(values)
    })(...emitters)
    const unsubReject = onceRace(...rejectEvents)((value) => {
      unsubResolve()
      reject(value)
    })(...emitters)
  })

export default onceAllPromiseReject
