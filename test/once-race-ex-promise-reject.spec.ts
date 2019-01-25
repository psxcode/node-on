import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { EventEmitter } from 'events'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceRacePromiseEx from '../src/once-race-ex-promise-reject'
import listenerCount from '../src/listener-count'

describe('[ onceRaceExPromiseReject ]', function () {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceRacePromiseEx([ 'error' ], [ 'event1', 'event2' ])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([
      [ { value: 'e1', event: 'event1', index: 0, emitter: ee, emitterIndex: 0 } ]
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
    onceRacePromiseEx([ 'error' ], [ 'event1', 'event2' ])(ee0, ee1, ee2).then(resolveSpy, rejectSpy)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee2.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([
      [ { value: 'e1', event: 'event1', index: 0, emitter: ee1, emitterIndex: 1 } ]
    ])
    expect(getSpyCalls(rejectSpy)).deep.eq([])
    expect(listenerCount(ee0, ee1, ee2)).eq(0)
  })

  it('single ee error', async () => {
    const ee = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceRacePromiseEx([ 'error' ], [ 'event1', 'event2' ])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('error', 'err')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([])
    expect(getSpyCalls(rejectSpy)).deep.eq([
      [ { value: 'err', event: 'error', index: 0, emitter: ee, emitterIndex: 0 } ]
    ])
    expect(listenerCount(ee)).eq(0)
  })
})
