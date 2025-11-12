import createClient, { type Middleware } from 'openapi-fetch'

import type { paths } from './schema.ts'

const config = {
  baseURL: null as string | null,
  apiKey: null as string | null,
  getAccessToken: null as (() => Promise<string | null>) | null,
  saveAccessToken: null as ((accessToken: string | null) => Promise<void>) | null,
  getRefreshToken: null as (() => Promise<string | null>) | null,
  saveRefreshToken: null as ((refreshToken: string | null) => Promise<void>) | null,
  toManyRequestsErrorHandler: null as ((message: string | null) => void) | null,
  logoutHandler: null as (() => void) | null,
}

export const setClientConfig = (newConfig: Partial<typeof config>) => {
  Object.assign(config, newConfig)
  _client = undefined // пере-инициализируем
}

export const getClientConfig = () => ({ ...config })

/* ------------------------------------------------------------------ */
/* 2.  Mutex для refresh-а                                             */
/* ------------------------------------------------------------------ */
let refreshPromise: Promise<string> | null = null

export function makeRefreshToken(): Promise<string> {
  if (!refreshPromise) {
    // 1) создаём «замок» сразу
    refreshPromise = (async (): Promise<string> => {
      const refreshToken = await config.getRefreshToken!()
      if (!refreshToken) throw new Error('No refresh token')

      const res = await fetch(`${config.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': config.apiKey!,
        },
        body: JSON.stringify({ refreshToken }),
      })
      if (res.status !== 201) throw new Error('Refresh failed')

      const { accessToken, refreshToken: newRT } = await res.json()
      await config.saveAccessToken!(accessToken)
      await config.saveRefreshToken!(newRT)

      return accessToken
    })().finally(() => {
      refreshPromise = null // 2) снимаем «замок»
    })
  }

  return refreshPromise
}

const authMiddleware: Middleware = {
  /* ---------- REQUEST -------------------------------------------------- */
  async onRequest({ request }) {
    request.headers.set('API-KEY', config.apiKey!)

    const token = await config.getAccessToken?.()
    if (token) request.headers.set('Authorization', `Bearer ${token}`)
    ;(request as any)._retryClone = request.clone()

    return request
  },
  async onResponse({ request, response }) {
    const req = request as Request & { _retry: boolean }

    if (response.status === 429) {
      const { message } = await response.clone().json()
      config.toManyRequestsErrorHandler?.(message)
    }

    if (response.status !== 401 || request.url.includes('/auth/refresh')) {
      return response // всё ок
    }

    // уже пытались? -> отдаём 401 наружу, чтобы не зациклиться
    if (req._retry) return response
    req._retry = true

    try {
      const newToken = await makeRefreshToken()

      // повторяем исходный запрос с новым токеном
      const orig = (req as any)._retryClone as Request // клон с целым body
      const retry = new Request(orig, { headers: new Headers(orig.headers) })
      retry.headers.set('Authorization', `Bearer ${newToken}`)
      return await fetch(retry)
    } catch (error) {
      console.log(error)
      // refresh не удался → чистим хранилище, отдаём 401
      await config.saveAccessToken!(null)
      await config.saveRefreshToken!(null)
      await config.logoutHandler?.()
      return response
    }
  },
}

let _client: ReturnType<typeof createClient<paths>> | undefined

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0'])

function isLocalClient(): boolean {
  if (typeof window === 'undefined') return false // не клиент
  const h = window.location.hostname
  return LOCAL_HOSTNAMES.has(h) || h.endsWith('.localhost')
}

export function assertApiConfig() {
  if (!config.baseURL) {
    const msg = 'baseURL is required. Call setClientConfig({ baseURL })'
    console.error(msg)
    throw new Error(msg)
  }
  if (isLocalClient() && !config.apiKey) {
    const msg =
      'apiKey is required when running client on localhost. Call setClientConfig({ apiKey })'
    console.error(msg)
    throw new Error(msg)
  }
}

export const getClient = () => {
  if (_client) return _client

  assertApiConfig()

  const client = createClient<paths>({ baseUrl: config.baseURL! })
  client.use(authMiddleware)
  _client = client
  return _client
}
