import { EventEmitter } from 'events'
import { expect } from 'chai'
import fn from 'test-fn'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceRacePromise from '../src/once-race-promise-reject'

describe('[ onceRacePromiseReject ]', () => {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const resolveSpy = fn()
    const rejectSpy = fn()

    /* subscribe */
    onceRacePromise(['error'], ['event1', 'event2'])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(resolveSpy.calls).deep.eq([
      ['e1'],
    ])
    expect(rejectSpy.calls).deep.eq([])
  })

  it('multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const resolveSpy = fn()
    const rejectSpy = fn()

    /* subscribe */
    onceRacePromise(['error'], ['event1', 'event2'])(ee0, ee1, ee2).then(resolveSpy, rejectSpy)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee2.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(resolveSpy.calls).deep.eq([
      ['e1'],
    ])
    expect(rejectSpy.calls).deep.eq([])
  })

  it('multiple ees error', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const resolveSpy = fn()
    const rejectSpy = fn()

    /* subscribe */
    onceRacePromise(['error'], ['event1', 'event2'])(ee0, ee1, ee2).then(resolveSpy, rejectSpy)

    ee0.emit('event0', 'e0')
    ee1.emit('error', 'err')
    ee2.emit('event1', 'e1')
    ee2.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(resolveSpy.calls).deep.eq([])
    expect(rejectSpy.calls).deep.eq([
      ['err'],
    ])
  })
})
