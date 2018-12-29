import { EventEmitter } from 'events'
import onceRaceEx from './once-race-ex'

const onceRaceExPromiseReject = (rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve, reject) => {
    let done = false
    const resolveUnsub = onceRaceEx(...resolveEvents)((value) => {
      if (!done) {
        done = true
        rejectUnsub()
        resolve(value)
      }
    })(...emitters)
    const rejectUnsub = onceRaceEx(...rejectEvents)((error) => {
      if (!done) {
        done = true
        resolveUnsub()
        reject(error)
      }
    })(...emitters)
  })

export default onceRaceExPromiseReject
