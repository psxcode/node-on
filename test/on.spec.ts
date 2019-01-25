import { EventEmitter } from 'events'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { waitTimePromise as wait } from '@psxcode/wait'
import on from '../src/on'
import listenerCount from '../src/listener-count'

describe('[ on ]', () => {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const spy = createSpy(() => {})

    /* subscribe */
    const unsub = on('event1', 'event2')(spy)(ee)

    ee.emit('event0')

    ee.emit('event1', 'e1')

    ee.emit('event1', 'e1-repeat')

    ee.emit('event2', 'e2')

    /* unsubscribe */
    unsub()

    ee.emit('event1', 'e1-more')
    ee.emit('event2', 'e2-more')

    /* wait for ee */
    await wait(0)

    expect(getSpyCalls(spy)).deep.eq([
      ['e1'],
      ['e1-repeat'],
      ['e2'],
    ])
    expect(listenerCount(ee)).eq(0)
  })

  it('multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const spy = createSpy(() => {})

    /* subscribe */
    const unsub = on('event1', 'event2')(spy)(ee0, ee1, ee2)

    ee0.emit('event0', 'e0')
    ee0.emit('event1', 'e1')
    ee1.emit('event1', 'e1-repeat')
    ee2.emit('event2', 'e2')

    /* unsubscribe */
    unsub()

    ee0.emit('event1')
    ee1.emit('event2')

    /* wait for ee */
    await wait(0)

    expect(getSpyCalls(spy)).deep.eq([
      ['e1'],
      ['e1-repeat'],
      ['e2'],
    ])
    expect(listenerCount(ee0, ee1, ee2)).eq(0)
  })
})