import { EventEmitter } from 'events'
import { expect } from 'chai'
import fn from 'test-fn'
import { waitTimePromise as wait } from '@psxcode/wait'
import onEx from '../src/on-ex'
import listenerCount from './listener-count'

describe('[ onEx ]', () => {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const spy = fn()

    /* subscribe */
    const unsub = onEx('event1', 'event2')(spy)(ee)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event1', 'e1-repeat')
    ee.emit('event2', 'e2')

    /* unsubscribe */
    unsub()

    ee.emit('event1')
    ee.emit('event2')

    /* wait for ee */
    await wait(0)

    expect(spy.calls).deep.eq([
      [{ value: 'e1', event: 'event1', index: 0, emitter: ee, emitterIndex: 0 }],
      [{ value: 'e1-repeat', event: 'event1', index: 1, emitter: ee, emitterIndex: 0 }],
      [{ value: 'e2', event: 'event2', index: 2, emitter: ee, emitterIndex: 0 }],
    ])
    expect(listenerCount(ee)).eq(0)
  })

  it('multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const spy = fn()

    /* subscribe */
    const unsub = onEx('event1', 'event2')(spy)(ee0, ee1, ee2)

    ee0.emit('event0', 'e0')
    ee0.emit('event1', 'e1')
    ee1.emit('event1', 'e1-repeat')
    ee2.emit('event2', 'e2')

    /* unsubscribe */
    unsub()

    ee0.emit('event1', 'e1-more')
    ee1.emit('event2', 'e2-more')

    /* wait for ee */
    await wait(0)

    expect(spy.calls).deep.eq([
      [{ value: 'e1', event: 'event1', index: 0, emitter: ee0, emitterIndex: 0 }],
      [{ value: 'e1-repeat', event: 'event1', index: 0, emitter: ee1, emitterIndex: 1 }],
      [{ value: 'e2', event: 'event2', index: 0, emitter: ee2, emitterIndex: 2 }],
    ])
    expect(listenerCount(ee0, ee1, ee2)).eq(0)
  })
})
