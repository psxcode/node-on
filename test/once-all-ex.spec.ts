import { EventEmitter } from 'events'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceAllEx from '../src/once-all-ex'
import listenerCount from './listener-count'

describe('[ onceAllEx ]', () => {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const spy = createSpy(() => {})

    /* subscribe */
    onceAllEx('event1', 'event2')(spy)(ee)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event1', 'e1-repeat')
    ee.emit('event2', 'e2')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(spy)).deep.eq([
      [
        [{ value: 'e1', event: 'event1', index: 0, emitter: ee, emitterIndex: 0 }],
      ],
    ])
    expect(listenerCount(ee)).eq(0)
  })

  it('multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const spy = createSpy(() => {})

    /* subscribe */
    onceAllEx('event1', 'event2', 'event3')(spy)(ee0, ee1, ee2)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee1.emit('event1', 'e1-repeat')
    ee2.emit('event2', 'e2')
    ee0.emit('event3', 'e3')
    ee0.emit('event3', 'e3-repeat')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(spy)).deep.eq([
      [
        [
          { value: 'e3', event: 'event3', index: 0, emitter: ee0, emitterIndex: 0 },
          { value: 'e1', event: 'event1', index: 0, emitter: ee1, emitterIndex: 1 },
          { value: 'e2', event: 'event2', index: 0, emitter: ee2, emitterIndex: 2 },
        ],
      ],
    ])
    expect(listenerCount(ee0, ee1, ee2)).eq(0)
  })

  it('early unsubscribe', async () => {
    const ee = new EventEmitter()
    const spy = createSpy(() => {})

    /* subscribe */
    const unsub = onceAllEx('event1', 'event2')(spy)(ee)

    /* early unsubscribe */
    unsub()

    ee.emit('event1', 'e1')
    ee.emit('event1', 'e1-repeat')
    ee.emit('event2', 'e2')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(spy)).deep.eq([])
    expect(listenerCount(ee)).eq(0)
  })
})
