import { EventEmitter } from 'events'
import { expect } from 'chai'
import fn from 'test-fn'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceAll from '../src/once-all'

describe('[ onceAll ]', () => {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const spy = fn()

    /* subscribe */
    onceAll('event1', 'event2')(spy)(ee)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event1', 'e1-repeat')
    ee.emit('event2', 'e2')

    /* wait for ee to fire */
    await wait(0)

    expect(spy.calls).deep.eq([
      [
        ['e1'],
      ],
    ])
  })

  it('multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const spy = fn()

    /* subscribe */
    onceAll('event1', 'event2')(spy)(ee0, ee1, ee2)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee1.emit('event1', 'e1-repeat')
    ee2.emit('event2', 'e2')
    ee0.emit('event1', 'ee0-e1')

    /* wait for ee to fire */
    await wait(0)

    expect(spy.calls).deep.eq([
      [
        ['ee0-e1', 'e1', 'e2'],
      ],
    ])
  })

  it('early unsubscribe', async () => {
    const ee = new EventEmitter()
    const spy = fn()

    /* subscribe */
    const unsub = onceAll('event1', 'event2')(spy)(ee)

    /* early unsubscribe */
    unsub()

    ee.emit('event1', 'e1')
    ee.emit('event1', 'e1-repeat')
    ee.emit('event2', 'e2')

    /* wait for ee to fire */
    await wait(0)

    expect(spy.calls).deep.eq([])
  })
})
