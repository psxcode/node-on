import EventEmitter = NodeJS.EventEmitter
import onceAllEx from './once-all-ex'
import { EmitterValue } from './types'

function onceAllPromiseEx (...events: string[]): (...emitters: EventEmitter[]) => Promise<EmitterValue[]>
function onceAllPromiseEx (rejectEvents: string[], resolveEvents: string[]): (...emitters: EventEmitter[]) => Promise<EmitterValue[]>

function onceAllPromiseEx (...events: any[]) {
  let rejectEvents: string[] = []

  if (events.length === 2 && Array.isArray(events[0])) {
    rejectEvents = events[0]
  }

  return (...emitters: EventEmitter[]) =>
    new Promise((resolve, reject) => {
      onceAllEx(...events)(values => {

        /* check for reject events */
        let errorValues = []
        for (let i = 0; i < rejectEvents.length; ++i) {
          for (let k = 0; k < values.length; ++k) {
            if (values[k].event === rejectEvents[i]) {
              errorValues.push(values[k])
            }
          }
        }

        errorValues.length
          ? reject(errorValues)
          : resolve(values)
      })(...emitters)
    })
}

export default onceAllPromiseEx
