import { EventEmitter } from 'events'
import onceRace from './once-race'
import on from './on'

const onceRacePromise = (rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve, reject) => {
    let done = false
    const resolveUnsub = onceRace(...resolveEvents)((value) => {
      if (!done) {
        done = true
        rejectUnsub()
        resolve(value)
      }
    })(...emitters)
    const rejectUnsub = on(...rejectEvents)((error) => {
      if (!done) {
        done = true
        resolveUnsub()
        reject(error)
      }
    })(...emitters)
  })

export default onceRacePromise
