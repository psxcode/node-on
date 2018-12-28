import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { EventEmitter } from 'events'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceAllPromise from './once-all-promise'

describe('[ onceAllPromise ]', function () {
  it('should resolve when all of events fires', async () => {
    const ee = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

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

    expect(getSpyCalls(resolveSpy)).deep.eq(
      [
        ['e1', 'e2', 'e3']
      ]
    )
    expect(getSpyCalls(rejectSpy)).deep.eq(
      []
    )
  })

  it('should resolve with error event names provided', async () => {
    const ee = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceAllPromise(['error'], ['event1', 'event2', 'event3'])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event2', 'e2')
    ee.emit('event2', 'e2-repeat')
    ee.emit('event3', 'e3')
    ee.emit('event3', 'e3-repeat')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq(
      [
        ['e1', 'e2', 'e3']
      ]
    )
    expect(getSpyCalls(rejectSpy)).deep.eq(
      []
    )
  })

  it('should resolve with error event names provided', async () => {
    const ee = new EventEmitter()
    const resolveSpy = createSpy(() => {})
    const rejectSpy = createSpy(() => {})

    /* subscribe */
    onceAllPromise(['error'], ['event1', 'event2'])(ee).then(resolveSpy, rejectSpy)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('error', 'err')
    ee.emit('event2', 'e2')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(resolveSpy)).deep.eq(
      []
    )
    expect(getSpyCalls(rejectSpy)).deep.eq(
      [
        ['err']
      ]
    )
  })
})
