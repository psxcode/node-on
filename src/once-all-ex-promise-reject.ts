import { EventEmitter } from 'events'
import onceAllEx from './once-all-ex'
import onceRaceEx from './once-race-ex'

const onceAllPromiseExReject = (rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve, reject) => {
    const resolveUnsub = onceAllEx(...resolveEvents)((values) => {
      rejectUnsub()
      resolve(values)
    })(...emitters)
    const rejectUnsub = onceRaceEx(...rejectEvents)((value) => {
      resolveUnsub()
      reject(value)
    })(...emitters)
  })

export default onceAllPromiseExReject
