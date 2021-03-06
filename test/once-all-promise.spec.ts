import { EventEmitter } from 'events'
import { expect } from 'chai'
import fn from 'test-fn'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceAllPromise from '../src/once-all-promise'

describe('[ onceAllPromise ]', () => {
  it('single ee', async () => {
    const ee = new EventEmitter()
    const resolveSpy = fn()
    const rejectSpy = fn()

    /* subscribe */
    onceAllPromise('event1', 'event2', 'event3')(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')
    ee.emit('event2', 'e2-repeat')
    ee.emit('event3', 'e3')
    ee.emit('event3', 'e3-repeat')

    /* wait for ee to fire */
    await wait(0)

    expect(resolveSpy.calls).deep.eq([
      [
        ['e1'],
      ],
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
    onceAllPromise('event1', 'event2', 'event3')(ee0, ee1, ee2).then(resolveSpy, rejectSpy)

    ee0.emit('event0', 'e0')
    ee1.emit('event1', 'e1')
    ee2.emit('event2', 'e2')
    ee2.emit('event2', 'e2-repeat')
    ee0.emit('event3', 'e3')
    ee0.emit('event3', 'e3-repeat')

    /* wait for ee to fire */
    await wait(0)

    expect(resolveSpy.calls).deep.eq([
      [
        ['e3', 'e1', 'e2'],
      ],
    ])
    expect(rejectSpy.calls).deep.eq([])
  })
})
