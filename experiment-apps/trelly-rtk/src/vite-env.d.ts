/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_API_KEY: string
  readonly VITE_DOMAIN_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
