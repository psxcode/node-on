import { EventEmitter } from 'events'
import { expect } from 'chai'
import fn from 'test-fn'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceRacePromiseEx from '../src/once-race-ex-promise'

describe('[ onceRacePromiseEx ]', () => {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const spy = fn()

    /* subscribe */
    onceRacePromiseEx('event1', 'event2')(ee).then(spy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(spy.calls).deep.eq([
      [
        { value: 'e1', event: 'event1', index: 0, emitter: ee, emitterIndex: 0 },
      ],
    ])
  })

  it('multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const spy = fn()

    /* subscribe */
    onceRacePromiseEx('event1', 'event2')(ee0, ee1, ee2).then(spy)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee2.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(spy.calls).deep.eq([
      [
        { value: 'e1', event: 'event1', index: 0, emitter: ee1, emitterIndex: 1 },
      ],
    ])
  })
})
