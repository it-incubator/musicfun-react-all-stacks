import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './schema.ts'

const config = {
  baseURL: null as string | null,
  apiKey: null as string | null,
  getAccessToken: null as (() => Promise<string | null>) | null,
  saveAccessToken: null as ((accessToken: string | null) => Promise<void>) | null,
  getRefreshToken: null as (() => Promise<string | null>) | null,
  saveRefreshToken: null as ((refreshToken: string | null) => Promise<void>) | null,
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

function makeRefreshToken(): Promise<string> {
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
      await config.saveAccessToken!(null)
      await config.saveRefreshToken!(null)
      return response
    }
  },
}

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
