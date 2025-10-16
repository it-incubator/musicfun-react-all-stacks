import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosError, // CHANGED: добавил для нормализации ошибок
} from 'axios'
import { API_KEY, API_PREFIX_ROOT, API_ROOT, VERSION_ROOT } from '@/shared/api/api-root/api-root'
import { tokenStorage } from '@/shared/storage/tokenStorage'
import { RETRY_HEADER_CONST } from '@/shared/consts/consts'
import { makeFullUrl } from '@/shared/utils/makeFullUrl'

type ApiPrefixT = (typeof API_PREFIX_ROOT)[keyof typeof API_PREFIX_ROOT]

let refreshTokenPromise: Promise<void> | null = null
const RETRY_HEADER = RETRY_HEADER_CONST

const normalizeAxiosError = (e: unknown): AxiosError => {
  if (axios.isAxiosError(e)) return e
  const err = new AxiosError(typeof e === 'string' ? e : 'Unknown error')
  ;(err as any).cause = e
  return err
}

const makeRefreshUrl = () => {
  const base = (API_ROOT || '').replace(/\/+$/, '')
  const ver = String(VERSION_ROOT).replace(/^\/+|\/+$/g, '') // CHANGED: режем слэши по краям
  const pfxAuth = String(API_PREFIX_ROOT.AUTH).replace(/^\/+|\/+$/g, '')
  return `${base}/${ver}/${pfxAuth}/refresh`
}

const ensureRefresh = (): Promise<void> => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = (async () => {
      const refreshToken = await tokenStorage.getRefresh()
      if (!refreshToken) {
        console.warn('Refresh токен не найден')
      }

      const url = makeRefreshUrl()
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

      const data = res.data as { accessToken?: string; refreshToken?: string }
      await tokenStorage.set({
        accessToken: data?.accessToken ?? '',
        refreshToken: data?.refreshToken ?? '',
      })
    })()
      .catch(async (e) => {
        const err = normalizeAxiosError(e)
        console.warn('REFRESH ERROR:', err.message)
        await tokenStorage.clear()
        console.warn(err)
      })
      .finally(() => {
        refreshTokenPromise = null
      })
  }
  return refreshTokenPromise
}

export const httpApiInterceptor = (prefix: ApiPrefixT, version = VERSION_ROOT): AxiosInstance => {
  const base = (API_ROOT || '').replace(/\/+$/, '')
  const pfx = String(prefix).replace(/^\/+|\/+$/g, '')
  const ver = String(version).replace(/^\/+|\/+$/g, '')

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
      // CHANGED: для логов используем helper, а не конкатенацию baseURL+url
      const rUrl = makeFullUrl(config.baseURL, config.url)
      console.log('REQUEST:', method, rUrl)
      if (config.params) console.log('params:', config.params)
      if (config.data) console.log('body  :', config.data)

      const headers = AxiosHeaders.from(config.headers || {})
      headers.set('Origin', 'http://localhost:3000')
      if (API_KEY) headers.set('api-key', API_KEY)

      const accessToken = await tokenStorage.getAccess()
      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

      if (typeof config.url === 'string') {
        config.url = '/' + config.url.replace(/^\/+/, '')
      }

      config.headers = headers
      return config
    },
    (error) => {
      console.log('REQUEST ERROR:', error?.message)
      return Promise.reject(normalizeAxiosError(error)) // CHANGED
    },
  )

  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      const method = (res.config.method || 'get').toUpperCase()
      const full = makeFullUrl(res.config.baseURL, res.config.url)
      console.log('RESPONSE:', res.status, method, full)
      return res
    },
    async (error) => {
      const err = normalizeAxiosError(error)
      const cfg = (err.config || {}) as InternalAxiosRequestConfig

      const method = (cfg.method || 'get').toUpperCase()
      const full = makeFullUrl(cfg.baseURL, cfg.url)
      const status = err.response?.status ?? 'NET-ERR'
      console.log('RESPONSE ERROR:', status, method, full)
      console.log('msg:', err.message)

      if (err.response?.status !== 401) return Promise.reject(err)

      const localUrl = String(cfg.url || '')
      if (/\/auth\/login/i.test(localUrl) || /\/auth\/refresh/i.test(localUrl)) {
        return Promise.reject(err)
      }

      const hdrs = AxiosHeaders.from(cfg.headers || {})
      if (hdrs.get(RETRY_HEADER) === '1') return Promise.reject(err)

      try {
        await ensureRefresh()

        const newAccess = (await tokenStorage.getAccess()) || ''
        hdrs.set('Origin', 'http://localhost:3000')
        if (API_KEY) hdrs.set('api-key', API_KEY)
        if (newAccess) hdrs.set('Authorization', `Bearer ${newAccess}`)
        hdrs.set(RETRY_HEADER, '1')

        const retryConfig: AxiosRequestConfig = {
          ...cfg,
          headers: hdrs,
          url: '/' + String(cfg.url || '').replace(/^\/+/, ''),
        }

        const rMethod = (retryConfig.method || 'get').toUpperCase()
        const rFull = makeFullUrl(retryConfig.baseURL as string, retryConfig.url as string)
        console.log('RETRY REQUEST:', rMethod, rFull)
        if (retryConfig.params) console.log('params:', retryConfig.params)
        if (retryConfig.data) console.log('body  :', retryConfig.data)

        return instance.request(retryConfig)
      } catch (e) {
        const rfErr = normalizeAxiosError(e)
        console.error('refresh failed:', rfErr.message)
        return Promise.reject(err)
      }
    },
  )

  return instance
}
