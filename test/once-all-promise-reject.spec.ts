import { EventEmitter } from 'events'
import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceAllPromiseReject from '../src/once-all-promise-reject'
import listenerCount from './listener-count'

describe('[ onceAllPromiseReject ]', () => {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceAllPromiseReject(['error'], ['event1', 'event2', 'event3'])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')
    ee.emit('event2', 'e2-repeat')
    ee.emit('event3', 'e3')
    ee.emit('event3', 'e3-repeat')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([[['e1']]])
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
    onceAllPromiseReject(['error'], ['event1', 'event2', 'event3'])(ee0, ee1, ee2).then(resolveSpy, rejectSpy)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee2.emit('event2', 'e2')
    ee2.emit('event2', 'e2-repeat')
    ee0.emit('event3', 'e3')
    ee0.emit('event3', 'e3-repeat')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([[['e3', 'e1', 'e2']]])
    expect(getSpyCalls(rejectSpy)).deep.eq([])
    expect(listenerCount(ee0, ee1, ee2)).eq(0)
  })

  it('single ee error', async () => {
    const ee = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceAllPromiseReject(['error'], ['event1', 'event2'])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('error', 'err')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq([])
    expect(getSpyCalls(rejectSpy)).deep.eq([['err']])
    expect(listenerCount(ee)).eq(0)
  })
})
