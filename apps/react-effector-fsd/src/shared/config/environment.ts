import { createStore } from 'effector'

export const $isClient = createStore(typeof document !== 'undefined', {
  serialize: 'ignore',
})
