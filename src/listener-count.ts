import { EventEmitter } from 'events'

const listenerCount = (...emitters: EventEmitter[]) => {
  let numListeners = 0
  for (let i = 0; i < emitters.length; ++i) {
    numListeners += emitters[i].eventNames().length
  }

  return numListeners
}

export default listenerCount
