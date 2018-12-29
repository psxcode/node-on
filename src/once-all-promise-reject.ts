import { EventEmitter } from 'events'
import onceAll from './once-all'
import onceRace from './once-race'

const onceAllPromiseReject = (rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve, reject) => {
    let done = false
    const unsubResolve = onceAll(...resolveEvents)((values) => {
      if (!done) {
        done = true
        unsubReject()
        resolve(values)
      }
    })(...emitters)
    const unsubReject = onceRace(...rejectEvents)((value) => {
      if (!done) {
        done = true
        unsubResolve()
        reject(value)
      }
    })(...emitters)
  })

export default onceAllPromiseReject
