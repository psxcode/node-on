import { EventEmitter } from 'events'
import onceRace from './once-race'

const onceRacePromise = (...events: string[]) => (...emitters: EventEmitter[]) =>
  new Promise((resolve) => {
    onceRace(...events)(resolve)(...emitters)
  })

export default onceRacePromise
