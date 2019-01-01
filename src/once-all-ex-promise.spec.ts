import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { EventEmitter } from 'events'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceAllPromiseEx from './once-all-ex-promise'
import listenerCount from './listener-count'

describe('[ onceAllExPromise ]', function () {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceAllPromiseEx('event1', 'event2', 'event3')(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')
    ee.emit('event2', 'e2-repeat')
    ee.emit('event3', 'e3')
    ee.emit('event3', 'e3-repeat')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([
      [ [ { value: 'e1', event: 'event1', index: 0, emitter: ee, emitterIndex: 0 } ] ]
    ])
    expect(getSpyCalls(rejectSpy)).deep.eq([])
    expect(listenerCount(ee)).eq(0)
  })

  it('multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceAllPromiseEx('event1', 'event2', 'event3')(ee0, ee1, ee2).then(resolveSpy, rejectSpy)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee2.emit('event2', 'e2')
    ee2.emit('event2', 'e2-repeat')
    ee0.emit('event3', 'e3')
    ee0.emit('event3', 'e3-repeat')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([
      [ [
        { value: 'e3', event: 'event3', index: 0, emitter: ee0, emitterIndex: 0 },
        { value: 'e1', event: 'event1', index: 0, emitter: ee1, emitterIndex: 1 },
        { value: 'e2', event: 'event2', index: 0, emitter: ee2, emitterIndex: 2 },
       ] ]
    ])
    expect(getSpyCalls(rejectSpy)).deep.eq([])
    expect(listenerCount(ee0, ee1, ee2)).eq(0)
  })
})