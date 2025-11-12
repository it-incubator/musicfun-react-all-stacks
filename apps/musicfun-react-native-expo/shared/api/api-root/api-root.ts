import Constants from 'expo-constants'

type Extra = {
  API_BASE_URL?: string
  API_API_KEY?: string
  env?: 'development' | 'production'
}

const extra = (Constants.expoConfig?.extra ?? {}) as Extra

if (!extra.API_BASE_URL) {
  console.warn(`Отсутствует API_BASE_URL , запросы будут падать `)
} else {
  console.log('API_BASE_URL обнаружен:', extra.API_BASE_URL)
}

if (!extra.API_API_KEY) {
  console.warn(`Отсутствует API_API_KEY, получите его на ресурсе https://apihub.it-incubator.io/en/2`)
} else {
  console.log('API_API_KEY обнаружен: ********************' /** extra.API_API_KEY */)
}

console.log('Режим работы .env через:', `.env.${extra.env}`)

export const API_ROOT = (extra.API_BASE_URL ?? '').trim()
export const API_KEY = (extra.API_API_KEY ?? '').trim()
export const VERSION_ROOT = '1.0'

export const API_PREFIX_ROOT = {
  TEST: 'test',
  AUTH: 'auth',
  PLAYLISTS: 'playlists',
} as const
