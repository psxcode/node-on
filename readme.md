# node-on

[![Greenkeeper badge](https://badges.greenkeeper.io/psxcode/node-on.svg)](https://greenkeeper.io/)

Node-js EventEmitter helpers

### Install
```
npm install node-on
```

### `on`
`(...events: string[]) => (callback: (val: any) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { on } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = on(
  'data',
  'end'    // events to listen
)(
  (value: any) => {} // your callback
)

const unsub = observer(
  e0,
  e1       // subscribe to emitters
) // return unsubscribe function

// unsubscribe
unsub()
```

### `onEx`
`(...events: string[]) => (callback: (val: {value: any, event: string, index: number, emitterIndex: number, emitter: EventEmitter}) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { onEx } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = onEx(
  'data',
  'end'    // events to listen
)(
  ({ value, event, index, emitterIndex, emitter }) => {} // your callback
)

const unsub = observer(e0, e1) // subscribe to emitters, return unsubscribe function

// unsubscribe
unsub()
```

### `onceAll`
`(...events: string[]) => (callback: (values: any[]) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { onceAll } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = onceAll(
  'data',
  'end'    // events to listen
)(
  (values: any[]) => {} // your callback
)

const unsub = observer(e0, e1) // subscribe to emitters, return unsubscribe function

// unsubscribe
unsub()
```

### `onceAllEx`
`(...events: string[]) => (callback: (val: { value: any, event: string, index: number, emitter: EventEmitter, emitterIndex: number }) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { onceAll } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = onceAll(
  'data',
  'end'    // events to listen
)(
  ({ value, event, index, emitter, emitterIndex }) => {} // your callback
)

const unsub = observer(e0, e1) // subscribe to emitters, return unsubscribe function

// unsubscribe
unsub()
```

### `onceAllPromise`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<any[]>`
```ts
import { onceAllPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceAllPromise(
  'data', // events to listen
)(
  e0,
  e1
).then(([valueFromEmitter0, valueFromEmitter1]) => {
  // your callback
})
```

### `onceAllExPromise`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<{ value: any, event: string, index: number, emitter: EventEmitter, emitterIndex: number }[]>`
```ts
import { onceAllPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceAllPromise(
  'data' // events to listen
)(
  e0,
  e1
).then(([emitterExValue0, emitterExValue1]) => {
  // your callback
})
```

### `onceAllPromiseReject`
`(rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) => Promise<any[]>`
```ts
import { onceAllPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceAllPromise(['error'], ['data'])(
  e0,
  e1
).then(([ valueFromEmitter0, valueFromEmitter1 ]) => {
  // your callback
}).catch((error: any) => {
  // your error handler
})
```

### `onceAllExPromiseReject`
`(rejectEvents: string[], resolveEvents: string[]) => (...emitters: EventEmitter[]) => Promise<{ value: any, event: string, index: number, emitter: EventEmitter, emitterIndex: number }[]>`
```ts
import { onceAllPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceAllPromise(['error'], ['data'])(
  e0,
  e1
).then(([ valueExFromEmitter0, valueExFromEmitter1 ]) => {
  // your callback
}).catch(({ value, event, index, emitterIndex, emitter }) => {
  // your error handler
})
```

### `onceRace`
`(...events: string[]) => (callback: (val: any) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { onceRace } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = onceRace(
  'data',
  'end'    // events to listen
)(
  (value: any) => {} // your callback
)

const unsub = observer(
  e0,
  e1        // subscribe to emitters
) // return unsubscribe function

// unsubscribe
unsub()
```

### `onceRaceEx`
`(...events: string[]) => (callback: (val: { value: any, event: string, index: number, emitterIndex: number, emitter: EventEmitter }) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { onceRace } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = onceRace(
  'data',
  'end'    // events to listen
)(
  ({ value: any, emitterIndex: number, emitter: EventEmitter }) => {} // your callback
)

const unsub = observer(
  e0,
  e1        // subscribe to emitters
) // return unsubscribe function

// unsubscribe
unsub()
```

### `onceRacePromise`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<any>`
```ts
import { onceRacePromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceRacePromise(
  'data',
  'end'    // events to listen
)(
  e0,
  e1       // subscribe to emitters
).then((value: any) => {
  // your callback
})
```

### `onceRaceExPromise`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<{ value: any, event: string, index: number, emitterIndex: number, emitter: EventEmitter }>`
```ts
import { onceRaceExPromise } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceRacePromiseEx(
  'data',
  'end'    // events to listen
)(
  e0,
  e1       // subscribe to emitters
).then(({ value, event, index, emitterIndex, emitter }) => {
  // your callback
})
```

### `onceRacePromiseReject`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<any>`
```ts
import { onceRacePromiseReject } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceRacePromise(['error'], ['data'])(
  e0,
  e1       // subscribe to emitters
).then((value: any) => {
  // your callback
}).catch((error: any) => {
  // error handler
})
```

### `onceRaceExPromiseReject`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<{ value: any, event: string, index: number, emitterIndex: number, emitter: EventEmitter }>`
```ts
import { onceRaceExPromiseReject } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceRacePromiseEx(['error'], ['data'])(
  e0,
  e1       // subscribe to emitters
).then(({ value, event, index, emitterIndex, emitter }) => {
  // your callback
}).catch(({ value, event, index, emitterIndex, emitter }) => {
  // error handler
})
```
