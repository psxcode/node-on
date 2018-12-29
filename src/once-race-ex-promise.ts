import { EventEmitter } from 'events'
import onceRaceEx from './once-race-ex'

const onceRacePromiseEx = (...events: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve) => {
    onceRaceEx(...events)(resolve)(...emitters)
  })

export default onceRacePromiseEx
