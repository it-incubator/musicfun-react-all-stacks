import { createEvent, sample } from 'effector'
import { initApiClientFx } from '@/features/auth/model/model.ts'
import { $isClient } from '@/shared/config/environment.ts'

export const appStarted = createEvent()

sample({
  clock: appStarted,
  filter: $isClient,
  target: initApiClientFx,
})
