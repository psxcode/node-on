import { EventEmitter } from 'events'
import { expect } from 'chai'
import fn from 'test-fn'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceRacePromiseEx from '../src/once-race-ex-promise-reject'
import listenerCount from './listener-count'

describe('[ onceRaceExPromiseReject ]', () => {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const resolveSpy = fn()
    const rejectSpy = fn()

    /* subscribe */
    onceRacePromiseEx(['error'], ['event1', 'event2'])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(resolveSpy.calls).deep.eq([
      [
        { value: 'e1', event: 'event1', index: 0, emitter: ee, emitterIndex: 0 },
      ],
    ])
    expect(rejectSpy.calls).deep.eq([])
    expect(listenerCount(ee)).eq(0)
  })

  it('multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const resolveSpy = fn()
    const rejectSpy = fn()

    /* subscribe */
    onceRacePromiseEx(['error'], ['event1', 'event2'])(ee0, ee1, ee2).then(resolveSpy, rejectSpy)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee2.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(resolveSpy.calls).deep.eq([
      [
        { value: 'e1', event: 'event1', index: 0, emitter: ee1, emitterIndex: 1 },
      ],
    ])
    expect(rejectSpy.calls).deep.eq([])
    expect(listenerCount(ee0, ee1, ee2)).eq(0)
  })

  it('single ee error', async () => {
    const ee = new EventEmitter()
    const resolveSpy = fn()
    const rejectSpy = fn()

    /* subscribe */
    onceRacePromiseEx(['error'], ['event1', 'event2'])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('error', 'err')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')

    /* wait for ee */
    await wait(0)

    expect(resolveSpy.calls).deep.eq([])
    expect(rejectSpy.calls).deep.eq([
      [
        { value: 'err', event: 'error', index: 0, emitter: ee, emitterIndex: 0 },
      ],
    ])
    expect(listenerCount(ee)).eq(0)
  })
})
