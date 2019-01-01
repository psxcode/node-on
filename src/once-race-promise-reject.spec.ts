import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { EventEmitter } from 'events'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceRacePromise from './once-race-promise-reject'

describe('[ onceRacePromiseReject ]', function () {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceRacePromise([ 'error' ], [ 'event1', 'event2' ])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([ [ 'e1' ] ])
    expect(getSpyCalls(rejectSpy)).deep.eq([])
  })

  it('multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceRacePromise([ 'error' ], [ 'event1', 'event2' ])(ee0, ee1, ee2).then(resolveSpy, rejectSpy)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee2.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([ [ 'e1' ] ])
    expect(getSpyCalls(rejectSpy)).deep.eq([])
  })

  it('multiple ees error', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceRacePromise([ 'error' ], [ 'event1', 'event2' ])(ee0, ee1, ee2).then(resolveSpy, rejectSpy)

    ee0.emit('event0', 'e0')
    ee1.emit('error', 'err')
    ee2.emit('event1', 'e1')
    ee2.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([])
    expect(getSpyCalls(rejectSpy)).deep.eq([ [ 'err' ] ])
  })
})
