// src/common/apiClient.ts

import { joinUrl } from "../common/utils/urlHelper"

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

type RequestInterceptor = (
  input: RequestInfo,
  init: RequestInit
) => Promise<[RequestInfo, RequestInit]>

type ResponseInterceptor = (
  response: Response,
  retry: () => Promise<Response>
) => Promise<Response>

export class ApiClient {
  private config: ApiClientConfig
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private isRefreshing = false
  private refreshPromise: Promise<void> | null = null

  constructor(config: ApiClientConfig) {
    this.config = config
    // default interceptors
    this.addRequestInterceptor(this.authRequestInterceptor.bind(this))
    this.addResponseInterceptor(this.tokenRefreshInterceptor.bind(this))
  }

  /**
   * Returns a shallow copy of the current configuration.
   */
  getConfig(): ApiClientConfig {
    return { ...this.config }
  }

  addRequestInterceptor(fn: RequestInterceptor) {
    this.requestInterceptors.push(fn)
  }

  addResponseInterceptor(fn: ResponseInterceptor) {
    this.responseInterceptors.push(fn)
  }

  private async authRequestInterceptor(
    input: RequestInfo,
    init: RequestInit
  ): Promise<[RequestInfo, RequestInit]> {
    const token = this.config.getAccessToken()
    if (token) {
      init.headers = { ...(init.headers ?? {}), Authorization: `Bearer ${token}` }
    }
    if (this.config.apiKey) {
      init.headers = { ...(init.headers ?? {}), "API-KEY": this.config.apiKey }
    }
    return [input, init]
  }

  private async tokenRefreshInterceptor(
    response: Response,
    retry: () => Promise<Response>
  ): Promise<Response> {
    if (response.status !== 401) return response

    if (!this.refreshPromise) {
      this.refreshPromise = this.handleRefresh()
    }
    await this.refreshPromise
    this.refreshPromise = null

    return retry()
  }

  private async handleRefresh(): Promise<void> {
    if (this.isRefreshing) return
    this.isRefreshing = true
    try {
      const refreshToken = this.config.getRefreshToken()
      if (!refreshToken) throw new Error("No refresh token")

      const url = `${this.config.baseURL}/auth/refresh`
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (this.config.apiKey) headers["API-KEY"] = this.config.apiKey

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ refreshToken }),
      })
      if (!res.ok) throw new Error("Refresh failed")
      const { accessToken, refreshToken: newRefresh } = await res.json()
      this.config.setTokens(accessToken, newRefresh)
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * Build full URL from baseURL, path and query params.
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(joinUrl(this.config.baseURL, path))
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, String(v))
      })
    }
    return url.toString()
  }

  /**
   * Core fetch with request/response interceptors and retry logic.
   */
  /**
   * Core fetch with request/response interceptors and retry logic.
   */
  private async fetchWithInterceptors(
    method: string,
    path: string,
    opts: RequestOptions = {}
  ): Promise<Response> {
    // prepare immutable base input and init
    const baseInput: RequestInfo = this.buildUrl(path, opts.params)
    const baseInit: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
      body:
        opts.body instanceof FormData
          ? opts.body
          : opts.body
            ? JSON.stringify(opts.body)
            : undefined,
      signal: opts.signal,
      ...(opts.nextOptions ? { next: opts.nextOptions } : {}),
    }

    // fetch call that reapplies request interceptors on each retry
    const fetchCall = async (): Promise<Response> => {
      let reqInput: RequestInfo = baseInput
      let reqInit: RequestInit = { ...baseInit }
      for (const interceptor of this.requestInterceptors) {
        [reqInput, reqInit] = await interceptor(reqInput, reqInit)
      }
      return fetch(reqInput, reqInit)
    }

    // initial request
    let response = await fetchCall()

    // apply response interceptors (e.g., token refresh)
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response, fetchCall)
    }

    return response
  }

  /**
   * Execute fetch and parse JSON, throwing on non-2xx.
   */
  private async fetchJson<T>(
    method: string,
    path: string,
    opts?: RequestOptions
  ): Promise<T> {
    const response = await this.fetchWithInterceptors(method, path, opts)
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || response.statusText)
    }
    return (await response.json()) as T
  }

  /**
   * Execute fetch and return both JSON data and original Response.
   */
  private async fetchFull<T>(
    method: string,
    path: string,
    opts?: RequestOptions
  ): Promise<{ data: T; response: Response }> {
    const response = await this.fetchWithInterceptors(method, path, opts)
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || response.statusText)
    }
    const data = (await response.clone().json()) as T
    return { data, response }
  }

  /** Public GET returning parsed JSON */
  get<T>(path: string, opts?: RequestOptions): Promise<T> {
    return this.fetchJson<T>("GET", path, opts)
  }

  /** Public GET returning data and raw Response */
  getFull<T>(path: string, opts?: RequestOptions): Promise<{ data: T; response: Response }> {
    return this.fetchFull<T>("GET", path, opts)
  }

  /** Public POST returning parsed JSON */
  post<T, B = any>(path: string, body: B, opts?: RequestOptions): Promise<T> {
    return this.fetchJson<T>("POST", path, { ...opts, body })
  }

  /** Public PUT returning parsed JSON */
  put<T, B = any>(path: string, body: B, opts?: RequestOptions): Promise<T> {
    return this.fetchJson<T>("PUT", path, { ...opts, body })
  }

  /** Public DELETE returning parsed JSON */
  delete<T>(path: string, opts?: RequestOptions): Promise<T> {
    return this.fetchJson<T>("DELETE", path, opts)
  }
}

// Singleton instance
let client: ApiClient
export function createApiClient(config: ApiClientConfig): ApiClient {
  client = new ApiClient(config)
  return client
}

export function getApiClient(): ApiClient {
  if (!client) throw new Error("ApiClient not initialized")
  return client
}

// Convenience initializer
export function configureApi(config: ApiClientConfig): ApiClient {
  return createApiClient(config)
}
