import { EventEmitter } from 'events'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { waitTimePromise as wait } from '@psxcode/wait'
import onceRaceEx from './once-race-ex'
import { EmitterValue } from './types'

describe('[ onceRaceEx ]', function () {
  this.slow(100)

  it('should work', async () => {
    const ee = new EventEmitter()
    const spy = sinon.spy()
    const unsub = onceRaceEx('e1', 'e2')(spy)(ee)

    await wait(10)
    sinon.assert.notCalled(spy)

    ee.emit('e0', 'value0')
    await wait(10)
    sinon.assert.notCalled(spy)

    ee.emit('e1', 'value1')
    await wait(10)
    sinon.assert.callCount(spy, 1)
    expect(spy.getCall(0).args[0]).deep.eq(
      {
        value: 'value1',
        emitterIndex: 0,
        emitter: ee
      } as EmitterValue
    )

    ee.emit('e1')
    await wait(10)
    sinon.assert.callCount(spy, 1)

    ee.emit('e2')
    await wait(10)
    sinon.assert.callCount(spy, 1)

    /* unsubscribe */
    unsub()

    ee.emit('e1')
    ee.emit('e2')
    await wait(10)
    sinon.assert.callCount(spy, 1)
  })

  it('should work with multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const spy = sinon.spy()
    const unsub = onceRaceEx('e1', 'e2')(spy)(ee0, ee1, ee2)

    await wait(10)
    sinon.assert.notCalled(spy)

    await wait(10)
    ee0.emit('e0', 'value0')
    sinon.assert.notCalled(spy)

    await wait(10)
    ee1.emit('e1', 'value1')
    sinon.assert.callCount(spy, 1)
    expect(spy.getCall(0).args[0]).deep.eq(
      {
        value: 'value1',
        emitterIndex: 1,
        emitter: ee1
      } as EmitterValue
    )

    await wait(10)
    ee0.emit('e1', 'value2')
    sinon.assert.callCount(spy, 1)

    await wait(10)
    ee2.emit('e2', 'value3')
    sinon.assert.callCount(spy, 1)

    /* unsubscribe */
    unsub()

    ee0.emit('e1')
    ee1.emit('e2')
    sinon.assert.callCount(spy, 1)
  })

  it('should work with early unsubscribe', async () => {
    const ee = new EventEmitter()
    const spy = sinon.spy()
    const unsub = onceRaceEx('e1', 'e2')(spy)(ee)

    await wait(10)
    sinon.assert.notCalled(spy)

    /* early unsubscribe */
    unsub()

    await wait(10)
    ee.emit('e1')
    sinon.assert.notCalled(spy)

    await wait(10)
    ee.emit('e1')
    sinon.assert.notCalled(spy)

    await wait(10)
    ee.emit('e2')
    sinon.assert.notCalled(spy)
  })
})
