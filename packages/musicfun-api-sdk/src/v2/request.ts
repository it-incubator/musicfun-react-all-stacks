// src/common/apiClient.ts

import { joinUrl } from '../common/utils/urlHelper'

export interface ApiClientConfig {
  baseURL: string
  apiKey?: string
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  setTokens: (accessToken: string, refreshToken: string) => void
}

export interface RequestOptions {
  params?: Record<string, any>
  body?: any
  signal?: AbortSignal
  nextOptions?: { revalidate?: number; tags?: string[] }
}

type RequestInterceptor = (input: RequestInfo, init: RequestInit) => Promise<[RequestInfo, RequestInit]>

type ResponseInterceptor = (response: Response, retry: () => Promise<Response>) => Promise<Response>

export interface ApiResponse<T> {
  data: T
  response: Response
}

export class ApiClient {
  private config: ApiClientConfig
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private isRefreshing = false
  private refreshPromise: Promise<void> | null = null

  constructor(config: ApiClientConfig) {
    this.config = config
    this.addRequestInterceptor(this.authRequestInterceptor.bind(this))
    this.addResponseInterceptor(this.tokenRefreshInterceptor.bind(this))
  }

  /** Shallow copy of config */
  getConfig(): ApiClientConfig {
    return { ...this.config }
  }

  addRequestInterceptor(fn: RequestInterceptor) {
    this.requestInterceptors.push(fn)
  }

  addResponseInterceptor(fn: ResponseInterceptor) {
    this.responseInterceptors.push(fn)
  }

  private async authRequestInterceptor(input: RequestInfo, init: RequestInit): Promise<[RequestInfo, RequestInit]> {
    const token = this.config.getAccessToken()
    if (token) init.headers = { ...(init.headers ?? {}), Authorization: `Bearer ${token}` }
    if (this.config.apiKey) init.headers = { ...(init.headers ?? {}), 'API-KEY': this.config.apiKey }
    return [input, init]
  }

  private async tokenRefreshInterceptor(response: Response, retry: () => Promise<Response>): Promise<Response> {
    if (response.status !== 401) return response
    if (!this.refreshPromise) this.refreshPromise = this.handleRefresh()
    await this.refreshPromise
    this.refreshPromise = null
    return retry()
  }

  private async handleRefresh(): Promise<void> {
    if (this.isRefreshing) return
    this.isRefreshing = true
    try {
      const refreshToken = this.config.getRefreshToken()
      if (!refreshToken) throw new Error('No refresh token')

      const url = `${this.config.baseURL}/auth/refresh`
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (this.config.apiKey) headers['API-KEY'] = this.config.apiKey

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ refreshToken }),
      })
      if (!res.ok) throw new Error('Refresh failed')

      const { accessToken, refreshToken: newRefresh } = await res.json()
      this.config.setTokens(accessToken, newRefresh)
    } finally {
      this.isRefreshing = false
    }
  }

  private buildUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(joinUrl(this.config.baseURL, path))
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, String(v))
      })
    }
    return url.toString()
  }

  private async sendRequest(method: string, path: string, opts: RequestOptions = {}): Promise<Response> {
    const baseInput: RequestInfo = this.buildUrl(path, opts.params)

    const headers: Record<string, string> = {}
    if (!(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const baseInit: RequestInit = {
      method,
      headers: headers,
      body: opts.body instanceof FormData ? opts.body : opts.body ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal,
      ...(opts.nextOptions ? { next: opts.nextOptions } : {}),
    }
    const fetchCall = async (): Promise<Response> => {
      // Явно указываем типы, чтобы TS не сузил reqInput до string
      let reqInput: RequestInfo = baseInput
      let reqInit: RequestInit = { ...baseInit }

      for (const interceptor of this.requestInterceptors) {
        const [nextInput, nextInit]: [RequestInfo, RequestInit] = await interceptor(reqInput, reqInit)

        reqInput = nextInput
        reqInit = nextInit
      }

      return fetch(reqInput, reqInit)
    }

    let response = await fetchCall()
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response, fetchCall)
    }
    return response
  }

  private async request<T>(method: string, path: string, opts?: RequestOptions): Promise<ApiResponse<T>> {
    const response = await this.sendRequest(method, path, opts)

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(errText || response.statusText)
    }

    // Клонируем, чтобы не «съесть» оригинальный response
    const clone = response.clone()
    const text = await clone.text()

    const data: T | null = text ? (JSON.parse(text) as T) : null

    return { data: data as T, response }
  }

  /** GET returning `{ data, response }` (data may be null on 204) */
  get<T>(path: string, opts?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, opts)
  }

  /** POST returning `{ data, response }` */
  post<T, B = any>(path: string, body: B, opts?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, { ...opts, body })
  }

  /** PUT returning `{ data, response }` */
  put<T, B = any>(path: string, body: B, opts?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, { ...opts, body })
  }

  /** DELETE returning `{ data, response }` */
  delete<T>(path: string, opts?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, opts)
  }
}

// singleton instance
let client: ApiClient

export function createApiClient(config: ApiClientConfig): ApiClient {
  client = new ApiClient(config)
  return client
}

export function getApiClient(): ApiClient {
  if (!client) throw new Error('ApiClient not initialized')
  return client
}

// alias for createApiClient
export const configureApi = createApiClient
