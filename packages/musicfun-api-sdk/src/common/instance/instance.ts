// import axios, { type AxiosError, AxiosInstance } from "axios"
// import { authApi } from "../../api/auth/authApi"
// import { localStorageKeys } from "../../api/auth/authApi.types"
// import { Nullable } from "../types/common.types"
//
// const config = {
//   baseURL: null as string | null,
//   apiKey: null as string | null,
//   accessTokenLocalStorageKey: localStorageKeys.accessToken,
//   refreshTokenLocalStorageKey: localStorageKeys.refreshToken
// }
//
// export const setInstanceConfig = (newConfig: Partial<typeof config>) => {
//   Object.assign(config, newConfig)
//   createInstance()
// }
//
// function createInstance() {
//   if (!config.baseURL || !config.apiKey) {
//     throw new Error("call setInstanceConfig to setup api")
//   }
//   const instance = axios.create({
//     baseURL: config.baseURL!,
//     headers: {
//       "API-KEY": config.apiKey
//     }
//   })
//
//   let isRefreshing = false
//   let failedQueue: {
//     resolve: (token: string) => void
//     reject: (err: unknown) => void
//   }[] = []
//
//   const processQueue = (error: unknown, token: Nullable<string>) => {
//     failedQueue.forEach((prom) => {
//       if (token) {
//         prom.resolve(token)
//       } else {
//         prom.reject(error)
//       }
//     })
//
//     failedQueue = []
//   }
//
//
//   // 👉 REQUEST INTERCEPTOR — добавляем accessToken
//   instance.interceptors.request.use((config) => {
//     if (typeof localStorage !== 'undefined') {
//       const token = localStorage.getItem(localStorageKeys.accessToken)
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     }
//
//     if (typeof window === 'undefined') {
//       config.headers.Origin = "http://localhost:3000" // hack for nextjs server request
//     }
//
//     return config
//   })
//
// // 👉 RESPONSE INTERCEPTOR — ловим 401 и пытаемся обновить токен
//   instance.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//       const originalRequest = error.config as any
//
//       if (error.response?.status === 401 && !originalRequest._retry) {
//         if(typeof localStorage === 'undefined') {
//           return Promise.reject(error)
//         }
//
//         const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
//         if (!refreshToken) {
//           return Promise.reject(error)
//         }
//
//         if (isRefreshing) {
//           // если уже идёт refresh — очередь
//           return new Promise((resolve, reject) => {
//             failedQueue.push({
//               resolve: (token: string) => {
//                 originalRequest.headers.Authorization = `Bearer ${token}`
//                 resolve(axios(originalRequest))
//               },
//               reject
//             })
//           })
//         }
//
//         originalRequest._retry = true
//         isRefreshing = true
//
//         try {
//           const response = await authApi.refreshToken({ refreshToken })
//           const { accessToken: newToken, refreshToken: newRefresh } = response.data
//
//           localStorage.setItem(localStorageKeys.accessToken, newToken)
//           localStorage.setItem(localStorageKeys.refreshToken, newRefresh)
//
//           processQueue(null, newToken)
//
//           originalRequest.headers.Authorization = `Bearer ${newToken}`
//           return axios(originalRequest)
//         } catch (err) {
//           processQueue(err, null)
//           localStorage.removeItem(localStorageKeys.accessToken)
//           localStorage.removeItem(localStorageKeys.refreshToken)
//           return Promise.reject(err)
//         } finally {
//           isRefreshing = false
//         }
//       }
//
//       return Promise.reject(error)
//     }
//   )
//   return instance;
// }
//
// let _instance: AxiosInstance | null = null
//
// export const getInstance = (): AxiosInstance => {
//   if (!_instance) {
//     _instance = createInstance()
//   }
//   return _instance!
// }
//
//
//
