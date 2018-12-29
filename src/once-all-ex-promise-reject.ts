import { EventEmitter } from 'events'
import onceAllEx from './once-all-ex'
import onceRaceEx from './once-race-ex'

const onceAllPromiseExReject = (rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve, reject) => {
    let done = false
    const resolveUnsub = onceAllEx(...resolveEvents)((values) => {
      if (!done) {
        done = true
        rejectUnsub()
        resolve(values)
      }
    })(...emitters)
    const rejectUnsub = onceRaceEx(...rejectEvents)((value) => {
      if (!done) {
        done = true
        resolveUnsub()
        reject(value)
      }
    })(...emitters)
  })

export default onceAllPromiseExReject
