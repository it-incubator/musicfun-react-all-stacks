import axios, { AxiosInstance } from 'axios'
import { API_KEY, API_PREFIX_ROOT, API_ROOT, VERSION_ROOT } from '@/shared/api/api-root/api-root'

type ApiPrefixT = (typeof API_PREFIX_ROOT)[keyof typeof API_PREFIX_ROOT]

export const httpApiInterceptor = (prefix: ApiPrefixT, version = VERSION_ROOT): AxiosInstance => {
  const base = (API_ROOT || '').replace(/\/+$/, '')
  const pfx = String(prefix).replace(/^\/+|\/+$/g, '')
  const ver = String(version).replace(/^\/+/, '')

  const instance = axios.create({
    baseURL: `${base}/${ver}/${pfx}/`,
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'api-key': `${API_KEY}` } : {}),
    },
  })

  instance.interceptors.request.use(
    (config) => {
      const method = (config.method || 'get').toUpperCase()
      const url = (config.baseURL || '') + (config.url || '')
      console.log('REQUEST:', method, url)
      if (config.params) console.log('params:', config.params)
      if (config.data) console.log('body  :', config.data)
      return config
    },
    (error) => {
      console.log('REQUEST ERROR:', error?.message)
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    (res) => {
      const method = (res.config.method || 'get').toUpperCase()
      const url = (res.config.baseURL || '') + (res.config.url || '')
      console.log('RESPONSE:', res.status, method, url)
      return res
    },
    (error) => {
      const cfg = error.config || {}
      const method = (cfg.method || 'get').toUpperCase()
      const url = (cfg.baseURL || '') + (cfg.url || '')
      const status = error.response?.status ?? 'NET-ERR'
      console.log('RESPONSE ERROR:', status, method, url)
      console.log('msg:', error.message)
      return Promise.reject(error)
    },
  )

  return instance
}
