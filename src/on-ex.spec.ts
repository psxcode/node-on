import { EventEmitter } from 'events'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { waitTimePromise as wait } from '@psxcode/wait'
import onEx from './on-ex'
import { EmitterValue } from './types'

describe('[ onEx ]', function () {
  this.slow(100)

  it('should work', async () => {
    const ee = new EventEmitter()
    const spy = sinon.spy()
    const unsub = onEx('e1', 'e2')(spy)(ee)

    await wait(50)
    sinon.assert.notCalled(spy)

    await wait(50)
    ee.emit('e0')
    sinon.assert.notCalled(spy)

    await wait(50)
    ee.emit('e1', 'value')
    sinon.assert.callCount(spy, 1)
    expect(spy.getCall(0).args[0]).deep.eq(
      {
        value: 'value',
        index: 0,
        emitterIndex: 0,
        emitter: ee,
        event: 'e1'
      } as EmitterValue
    )

    await wait(50)
    ee.emit('e1', 'value1')
    sinon.assert.callCount(spy, 2)
    expect(spy.getCall(1).args[0]).deep.eq(
      {
        value: 'value1',
        index: 1,
        emitterIndex: 0,
        emitter: ee,
        event: 'e1'
      } as EmitterValue
    )

    await wait(50)
    ee.emit('e2', 'value2')
    sinon.assert.callCount(spy, 3)
    expect(spy.getCall(2).args[0]).deep.eq(
      {
        value: 'value2',
        index: 0,
        emitterIndex: 0,
        emitter: ee,
        event: 'e2'
      } as EmitterValue
    )

    /* unsubscribe */
    unsub()

    ee.emit('e1')
    ee.emit('e2')
    sinon.assert.callCount(spy, 3)
  })

  it('should work with multiple ees', async () => {
    const ee0 = new EventEmitter()
    const ee1 = new EventEmitter()
    const ee2 = new EventEmitter()
    const spy = sinon.spy()
    const unsub = onEx('e1', 'e2')(spy)(ee0, ee1, ee2)

    await wait(50)
    sinon.assert.notCalled(spy)

    await wait(50)
    ee0.emit('e0')
    sinon.assert.notCalled(spy)

    await wait(50)
    ee0.emit('e1', 'value')
    sinon.assert.callCount(spy, 1)
    expect(spy.getCall(0).args[0]).deep.eq(
      {
        value: 'value',
        index: 0,
        emitterIndex: 0,
        emitter: ee0,
        event: 'e1'
      } as EmitterValue
    )

    await wait(50)
    ee1.emit('e1', 'value1')
    sinon.assert.callCount(spy, 2)
    expect(spy.getCall(1).args[0]).deep.eq(
      {
        value: 'value1',
        index: 0,
        emitterIndex: 1,
        emitter: ee1,
        event: 'e1'
      } as EmitterValue
    )

    await wait(50)
    ee2.emit('e2', 'value2')
    sinon.assert.callCount(spy, 3)
    expect(spy.getCall(2).args[0]).deep.eq(
      {
        value: 'value2',
        index: 0,
        emitterIndex: 2,
        emitter: ee2,
        event: 'e2'
      } as EmitterValue
    )

    /* unsubscribe */
    unsub()

    ee0.emit('e1')
    ee1.emit('e2')
    sinon.assert.callCount(spy, 3)
  })
})
