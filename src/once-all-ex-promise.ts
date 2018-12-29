import { EventEmitter } from 'events'
import onceAllEx from './once-all-ex'

const onceAllPromiseEx = (...events: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve) => {
    onceAllEx(...events)(resolve)(...emitters)
  })

export default onceAllPromiseEx
