import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios'
import { API_KEY, API_PREFIX_ROOT, API_ROOT, VERSION_ROOT } from '@/shared/api/api-root/api-root'
import { tokenStorage } from '@/shared/storage/tokenStorage'
import { RETRY_HEADER_CONST } from '@/shared/consts/consts'
import { makeFullUrl } from '@/shared/utils/makeFullUrl'

type ApiPrefixT = (typeof API_PREFIX_ROOT)[keyof typeof API_PREFIX_ROOT]

let refreshTokenPromise: Promise<void> | null = null
const RETRY_HEADER = RETRY_HEADER_CONST

const makeRefreshUrl = () => {
  const base = (API_ROOT || '').replace(/\/+$/, '')
  const ver = String(VERSION_ROOT).replace(/^\/+/, '')
  const pfxAuth = String(API_PREFIX_ROOT.AUTH).replace(/^\/+|\/+$/g, '')
  return `${base}/${ver}/${pfxAuth}/refresh`
}

const ensureRefresh = (): Promise<void> => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = (async () => {
      const refreshToken = await tokenStorage.getRefresh()
      if (!refreshToken) throw new Error('Refresh токен не найден')

      const url = makeRefreshUrl()
      try {
        const res = await axios.post(
          url,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              ...(API_KEY ? { 'api-key': API_KEY } : {}),
              Origin: 'http://localhost:3000',
            },
          },
        )

        if (res.status < 200 || res.status >= 300) throw new Error('Refresh токен не получен')

        const data = res.data as { accessToken?: string; refreshToken?: string }
        await tokenStorage.set({
          accessToken: data?.accessToken ?? '',
          refreshToken: data?.refreshToken ?? '',
        })
      } catch (e) {
        console.error('REFRESH ERROR:', (e as Error)?.message)
        await tokenStorage.clear()
        throw e
      }
    })().finally(() => {
      refreshTokenPromise = null
    })
  }
  return refreshTokenPromise
}

export const httpApiInterceptor = (prefix: ApiPrefixT, version = VERSION_ROOT): AxiosInstance => {
  const base = (API_ROOT || '').replace(/\/+$/, '')
  const pfx = String(prefix).replace(/^\/+|\/+$/g, '')
  const ver = String(version).replace(/^\/+/, '')

  const instance = axios.create({
    baseURL: `${base}/${ver}/${pfx}`,
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
      ...(API_KEY ? { 'api-key': API_KEY } : {}),
    },
  })

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const method = (config.method || 'get').toUpperCase()
      const url = (config.baseURL || '') + (config.url || '')
      const rUrl = makeFullUrl(config.baseURL, config.url)
      console.log('REQUEST:', method, rUrl)
      if (config.params) console.log('params:', config.params)
      if (config.data) console.log('body  :', config.data)

      const headers = AxiosHeaders.from(config.headers || {})

      headers.set('Origin', 'http://localhost:3000')
      if (API_KEY) headers.set('api-key', API_KEY)

      const accessToken = await tokenStorage.getAccess()
      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

      config.headers = headers
      return config
    },
    (error) => {
      console.log('REQUEST ERROR:', error?.message)
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      const method = (res.config.method || 'get').toUpperCase()
      const url = (res.config.baseURL || '') + (res.config.url || '')
      console.log('RESPONSE:', res.status, method, url)
      return res
    },
    async (error) => {
      const cfg = (error.config || {}) as InternalAxiosRequestConfig
      const method = (cfg.method || 'get').toUpperCase()
      const url = (cfg.baseURL || '') + (cfg.url || '')
      const status = error.response?.status ?? 'NET-ERR'
      console.log('RESPONSE ERROR:', status, method, url)
      console.log('msg:', error.message)

      if (error.response?.status !== 401) return Promise.reject(error)

      const isAuthEndpoint = /\/auth\/login/i.test(cfg.url || '') || /\/auth\/refresh/i.test(cfg.url || '')
      if (isAuthEndpoint) return Promise.reject(error)

      const hdrs = AxiosHeaders.from(cfg.headers || {})
      if (hdrs.get(RETRY_HEADER) === '1') return Promise.reject(error)

      try {
        await ensureRefresh()
        const newAccess = (await tokenStorage.getAccess()) || ''

        hdrs.set('Origin', 'http://localhost:3000')
        if (API_KEY) hdrs.set('api-key', API_KEY)
        if (newAccess) hdrs.set('Authorization', `Bearer ${newAccess}`)
        hdrs.set(RETRY_HEADER, '1')

        const retryConfig: AxiosRequestConfig = { ...cfg, headers: hdrs }

        const rMethod = (retryConfig.method || 'get').toUpperCase()
        const rUrl = (retryConfig.baseURL || '') + (retryConfig.url || '')
        console.log('RETRY REQUEST:', rMethod, rUrl)
        if (retryConfig.params) console.log('params:', retryConfig.params)
        if (retryConfig.data) console.log('body  :', retryConfig.data)

        const retryResp = await instance.request(retryConfig)
        console.log('RETRY RESPONSE:', retryResp.status, rMethod, rUrl)
        return retryResp
      } catch (e) {
        console.error('refresh failed:', (e as Error)?.message)
        return Promise.reject(error)
      }
    },
  )

  return instance
}
