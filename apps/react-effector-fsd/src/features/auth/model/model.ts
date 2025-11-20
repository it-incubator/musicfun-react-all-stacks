import { createEffect, createStore, sample } from 'effector'
import { localStorageKeys, type LoginRequestPayload, type RefreshOutput } from './auth-api.types'
import type { User } from './user.types'
import { meApi } from '../api/me'
import { loginApi } from '../api/login'
import { logoutApi } from '../api/logout'
import { setClientConfig } from '@/shared/api/client.ts'
import { API_BASE_URL, API_KEY } from '@/shared/config/config.ts'
import { toast } from 'react-toastify'

export const initApiClientFx = createEffect(() => {
  setClientConfig({
    baseURL: API_BASE_URL,
    apiKey: API_KEY,
    getAccessToken: async () => localStorage.getItem(localStorageKeys.accessToken),
    getRefreshToken: async () => localStorage.getItem(localStorageKeys.refreshToken),
    saveAccessToken: async (token) =>
      token
        ? localStorage.setItem(localStorageKeys.accessToken, token)
        : localStorage.removeItem(localStorageKeys.accessToken),
    saveRefreshToken: async (token) =>
      token
        ? localStorage.setItem(localStorageKeys.refreshToken, token)
        : localStorage.removeItem(localStorageKeys.refreshToken),

    toManyRequestsErrorHandler: (message: string | null) => {
      toast(message)
    },
    logoutHandler: () => {},
  })
})

export const fetchMeFx = createEffect<void, User>(meApi)
export const loginFx = createEffect<LoginRequestPayload, RefreshOutput>(loginApi)
export const logoutFx = createEffect(async () => {
  const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)!
  await logoutApi(refreshToken)
})

const saveTokensFx = createEffect((data: RefreshOutput) => {
  localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
  localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
})
const clearTokensFx = createEffect(() => {
  localStorage.removeItem(localStorageKeys.accessToken)
  localStorage.removeItem(localStorageKeys.refreshToken)
})

export const $me = createStore<User>(null)
  .on(fetchMeFx.doneData, (_, me) => me)
  .reset(logoutFx.done)

export const $isAuthorized = createStore<boolean>(false)
  .on(fetchMeFx.doneData, (_, me) => Boolean(me))
  .reset(logoutFx.done)

sample({
  clock: initApiClientFx.done,
  filter: () => Boolean(localStorage.getItem(localStorageKeys.accessToken)),
  target: fetchMeFx,
})

sample({
  clock: loginFx.doneData,
  target: saveTokensFx,
})
sample({
  clock: saveTokensFx.done,
  target: fetchMeFx,
})

sample({
  clock: logoutFx.done,
  target: clearTokensFx,
})
