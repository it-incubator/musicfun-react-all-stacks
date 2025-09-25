// custom-instance.ts

import Axios, { type AxiosRequestConfig } from 'axios'
import { apiBaseUrl, apiKey } from '@/shared/config/api.config.ts'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'api-key': apiKey,
  },
}) // use your own URL here or environment variable

export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source()
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data)

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}
