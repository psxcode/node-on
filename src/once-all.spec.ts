import { expect } from 'chai'
import { createSpy, getSpyCalls } from 'spyfn'
import { EventEmitter } from 'events'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceAll from './once-all'

describe('[ onceAll ]', function () {
  this.slow(100)

  it('should work', async () => {
    const ee = new EventEmitter()
    const spy = createSpy(() => {})

    /* subscribe */
    const unsub = onceAll('event1', 'event2')(spy)(ee)

    ee.emit('event0', 'e0')
    ee.emit('event1', 'e1')
    ee.emit('event1', 'e1-repeat')
    ee.emit('event2', 'e2')

    /* unsubscribe */
    unsub()

    ee.emit('event1')
    ee.emit('event2')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(spy)).deep.eq(
      [
        ['e1', 'e2']
      ]
    )
  })

  it('should work with early unsubscribe', async () => {
    const ee = new EventEmitter()
    const spy = createSpy(() => {})

    /* subscribe */
    const unsub = onceAll('event1', 'event2')(spy)(ee)

    /* early unsubscribe */
    unsub()

    ee.emit('event1', 'e1')
    ee.emit('event1', 'e1-repeat')
    ee.emit('event2', 'e2')

    /* wait for ee to fire */
    await wait(0)

    expect(getSpyCalls(spy)).deep.eq(
      []
    )
  })
})
