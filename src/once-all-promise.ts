import EventEmitter = NodeJS.EventEmitter
import onceAllEx from './once-all-ex'

function onceAllPromise (...events: string[]): (...emitters: EventEmitter[]) => Promise<any>
function onceAllPromise (rejectPromise: string[], resolvePromise: string[]): (...emitters: EventEmitter[]) => Promise<any>

function onceAllPromise (...events: any[]) {
  let rejectEvents: string[] = []

  if (events.length === 2 && Array.isArray(events[0])) {
    rejectEvents = events[0]
  }

  return (...emitters: EventEmitter[]) =>
    new Promise((resolve, reject) => {
      onceAllEx(...events)(emitterValues => {

        const values: any[] = []
        for (let i = 0; i < emitterValues.length; ++i) {
          values.push(emitterValues[i].value)
        }

        /* check for reject events */
        let errorValues: any[] = []
        for (let i = 0; i < rejectEvents.length; ++i) {
          for (let k = 0; k < emitterValues.length; ++k) {
            if (emitterValues[k].event === rejectEvents[i]) {
              errorValues.push(emitterValues[k].value)
            }
          }
        }

        errorValues.length
          ? reject(errorValues)
          : resolve(values)
      })(...emitters)
    })
}

export default onceAllPromise
