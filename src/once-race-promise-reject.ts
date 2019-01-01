import { EventEmitter } from 'events'
import onceRace from './once-race'
import on from './on'

const onceRacePromise = (rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve, reject) => {
    const resolveUnsub = onceRace(...resolveEvents)((value) => {
      rejectUnsub()
      resolve(value)
    })(...emitters)
    const rejectUnsub = on(...rejectEvents)((error) => {
      resolveUnsub()
      reject(error)
    })(...emitters)
  })

export default onceRacePromise
