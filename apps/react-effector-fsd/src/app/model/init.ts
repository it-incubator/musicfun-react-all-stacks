import { createEvent, sample } from 'effector'
import { initApiClientFx } from '@/features/auth/model/model.ts'

export const appStarted = createEvent()

sample({
  clock: appStarted,
  target: initApiClientFx,
})
