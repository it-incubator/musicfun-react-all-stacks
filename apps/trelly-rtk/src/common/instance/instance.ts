import { AUTH_TOKEN } from "@/common/constants"
import axios from "axios"

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "API-KEY": import.meta.env.VITE_API_KEY,
  },
})

instance.interceptors.request.use(function (config) {
  config.headers["Authorization"] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
  return config
})
