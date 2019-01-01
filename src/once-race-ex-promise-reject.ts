import { EventEmitter } from 'events'
import onceRaceEx from './once-race-ex'

const onceRaceExPromiseReject = (rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve, reject) => {
    const resolveUnsub = onceRaceEx(...resolveEvents)((value) => {
      rejectUnsub()
      resolve(value)
    })(...emitters)
    const rejectUnsub = onceRaceEx(...rejectEvents)((error) => {
      resolveUnsub()
      reject(error)
    })(...emitters)
  })

export default onceRaceExPromiseReject
