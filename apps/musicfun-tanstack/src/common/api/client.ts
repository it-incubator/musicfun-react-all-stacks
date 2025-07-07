// openapiClient.ts
import createClient, { type Middleware } from 'openapi-fetch'
import { localStorageKeys } from '@/modules/auth/api/authApi.types'
import type { paths } from '@/common/api/schema.ts'

const config = {
  baseURL: null as string | null,
  apiKey: null as string | null,
  accessTokenLocalStorageKey: localStorageKeys.accessToken,
  refreshTokenLocalStorageKey: localStorageKeys.refreshToken,
}

export const setClientConfig = (newConfig: Partial<typeof config>) => {
  Object.assign(config, newConfig)
  _client = undefined // пере-инициализируем
}

///////////////////////////////////////////////////////////////////////////////
// 🔑  Middleware c добавлением токена и refresh-логикой                     //
///////////////////////////////////////////////////////////////////////////////
const authMiddleware = (() => {
  let isRefreshing = false
  let failedQueue: {
    resolve: (token: string) => void
    reject: (err: unknown) => void
  }[] = []

  const processQueue = (error: unknown, token?: string) => {
    failedQueue.forEach((p) => {
      if (token) p.resolve(token)
      else p.reject(error)
    })
    failedQueue = []
  }

  const mw: Middleware = {
    /* ---------- REQUEST -------------------------------------------------- */
    async onRequest({ request }) {
      // → API-KEY
      request.headers.set('API-KEY', config.apiKey!)
      // → Bearer access-token
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem(config.accessTokenLocalStorageKey)
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      }
      // → Origin заголовок для SSR (как в оригинале)
      if (typeof window === 'undefined') {
        request.headers.set('Origin', 'http://localhost:3000')
      }
      return request
    },

    /* ---------- RESPONSE ------------------------------------------------- */
    async onResponse({ request, response }) {
      if (response.status !== 401) {
        if (response.status >= 400 && response.status < 600) {
          let details = ''
          try {
            // first attempt JSON, fall back to plain text
            details = await response.clone().json().then(JSON.stringify)
          } catch {
            details = await response.clone().text()
          }

          throw new Error(
            `${response.url}: ${response.status} ${response.statusText}` + (details ? ` – ${details}` : ''),
          )
        }

        return response
      }
      if (request.url.indexOf('auth/refresh') > -1) return response

      // уже был ретрай?
      // @ts-expect-error: add custom property _retry
      if (request._retry) return response
      // @ts-expect-error: add custom property _retry
      request._retry = true

      if (typeof localStorage === 'undefined') return response
      const refreshToken = localStorage.getItem(config.refreshTokenLocalStorageKey)
      if (!refreshToken) return response

      /* ===== очередь, пока идёт refresh ===== */
      if (isRefreshing) {
        return new Promise<Response>((resolve, reject) => {
          failedQueue.push({
            resolve: async (token: string) => {
              // повторяем ИМЕННО исходный запрос с новым токеном
              const retry = new Request(request, {
                headers: new Headers(request.headers),
              })
              retry.headers.set('Authorization', `Bearer ${token}`)
              try {
                resolve(await fetch(retry))
              } catch (e) {
                reject(e)
              }
            },
            reject,
          })
        })
      }

      /* ===== делаем refresh ===== */
      isRefreshing = true
      try {
        const response = await getClient().POST('/auth/refresh', {
          body: {
            refreshToken: refreshToken,
          },
        })

        if (response.response.status === 201) {
          localStorage.setItem(config.accessTokenLocalStorageKey, response.data!.accessToken)
          localStorage.setItem(config.refreshTokenLocalStorageKey, response.data!.refreshToken)

          processQueue(null, response.data!.accessToken)

          // повторяем собственный запрос
          const retry = new Request(request, {
            headers: new Headers(request.headers),
          })
          retry.headers.set('Authorization', `Bearer ${response.data!.accessToken}`)

          return await fetch(retry)
        } else {
          throw new Error("Refresh is can't be processed")
        }
      } catch (err) {
        processQueue(err, undefined)
        localStorage.removeItem(config.accessTokenLocalStorageKey)
        localStorage.removeItem(config.refreshTokenLocalStorageKey)
        return response // отдадим исходный 401
      } finally {
        isRefreshing = false
      }
    },

    /* ---------- NETWORK-ошибки ------------------------------------------ */
    // onError({ error }) {
    //   // просто оборачиваем, как у вас в примере комментария
    //   throw new Error("Oops, fetch failed")
    // },
  }

  return mw
})()

///////////////////////////////////////////////////////////////////////////////
// 🔧  Singleton-клиент (аналог getInstance)                                 //
///////////////////////////////////////////////////////////////////////////////
let _client: ReturnType<typeof createClient<paths>> | undefined

export const getClient = () => {
  if (_client) return _client

  if (!config.baseURL || !config.apiKey) {
    console.error('call setClientConfig to setup api')
    throw new Error('call setClientConfig to setup api')
  }

  const client = createClient<paths>({ baseUrl: config.baseURL })
  client.use(authMiddleware)
  _client = client
  return _client
}

export const getApiConfig = () => ({ ...config })
