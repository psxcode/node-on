import { EventEmitter } from 'events'
import onceAll from './once-all'

const onceAllPromise = (...events: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve) => {
    onceAll(...events)(resolve)(...emitters)
  })

export default onceAllPromise
