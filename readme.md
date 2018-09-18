# node-on

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

// cancel subscription
unsub()
```

### `onEx`
`(...events: string[]) => (callback: (val: {value: any, emitterIndex: number, emitter: EventEmitter}) => void) => (...emitters: EventEmitter[]) => () => void`
```ts
import { onEx } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

const observer = onEx(
  'data',
  'end'    // events to listen
)(
  ({ value: any, emitterIndex: number, emitter: EventEmitter }) => {} // your callback
)

const unsub = observer(e0, e1) // subscribe to emitters, return unsubscribe function

// cancel subscription
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

// cancel subscription
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
  'data',
  'end'    // events to listen
)(
  e0,
  e1
).then((values: any[]) => {
  // your callback
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

// cancel subscription
unsub()
```

### `onceRaceEx`
`(...events: string[]) => (callback: (val: { value: any, emitterIndex: number, emitter: EventEmitter }) => void) => (...emitters: EventEmitter[]) => () => void`
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

// cancel subscription
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

### `onceRacePromiseEx`
`(...events: string[]) => (...emitters: EventEmitter[]) => Promise<{ value: any, emitterIndex: number, emitter: EventEmitter }>`
```ts
import { onceRacePromiseEx } from 'node-on'

// we have the following emitters
declare const e0: EventEmitter,
              e1: EventEmitter

onceRacePromiseEx(
  'data',
  'end'    // events to listen
)(
  e0,
  e1       // subscribe to emitters
).then(({ value: any, emitterIndex: number, emitter: EventEmitter }) => {
  // your callback
})

```
