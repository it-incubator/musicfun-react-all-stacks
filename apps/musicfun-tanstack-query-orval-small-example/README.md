https://chatgpt.com/c/6867c378-f864-8006-85a1-98da24df147c?model=o4-mini-high

## Create Vite React Project

pnpm create vite
https://vite.dev/guide/

## Tanstack Installation

https://tanstack.com/query/latest/docs/framework/react/installation

pnpm add @tanstack/react-query

## clear app.tsx

```tsx
function App() {
  return <>Hello</>
}

export default App
```

## remove StrictMode

in main.tsx

## activate eslint on save

## run project

pnpm dev

## generate api layer

https://openapi-ts.dev/introduction

pnpm i -D openapi-typescript typescript

And in your tsconfig.json, to load the types properly:
"compilerOptions": {
"module": "ESNext", // or "NodeNext"
"moduleResolution": "Bundler" // or "NodeNext"
}

Highly recommended

Also adding the following can boost type safety:

tsconfig.json

{
"compilerOptions": {
"noUncheckedIndexedAccess": true
}
}

## install openapi-fetch

pnpm i openapi-fetch

## add script and generate api

"generate:api": "pnpm dlx openapi-typescript https://spotifun.it-incubator.app/api-json -o ./src/shared/api/schema.ts"

# add env files

.env
VITE_BASE_URL=https://spotifun.it-incubator.app/api/1.0
VITE_API_KEY=
VITE_CURRENT_DOMAIN=http://localhost:5174

.env.local
VITE_API_KEY=72c3121c-c679-4c0e-9131-2d3f35e6a3bd

## add client.tsx

```typescript
import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './schema.ts'

const config = {
  baseURL: null as string | null,
  apiKey: null as string | null,
  getAccessToken: null as (() => Promise<string | null>) | null,
  saveAccessToken: null as (() => Promise<void>) | null,
  getRefreshToken: null as (() => Promise<string | null>) | null,
  saveRefreshToken: null as (() => Promise<void>) | null,
}

export const setClientConfig = (newConfig: Partial<typeof config>) => {
  Object.assign(config, newConfig)
  _client = undefined // пере-инициализируем
}

const authMiddleware: Middleware = {
  /* ---------- REQUEST -------------------------------------------------- */
  async onRequest({ request }) {
    request.headers.set('API-KEY', config.apiKey!)

    const token = await config.getAccessToken?.()
    if (token) request.headers.set('Authorization', `Bearer ${token}`)

    return request
  },
}

let _client: ReturnType<typeof createClient<paths>> | undefined

export const getClient = () => {
  if (_client) return _client

  if (!config.baseURL || !config.apiKey) {
    console.error('call setClientConfig to setup api')
    throw new Error('call setClientConfig to setup api')
  }

  const client = createClient<paths>({ baseUrl: config.baseURL })
  client.use(authMiddleware)
  _client = client
  return _client
}
```

## setup client in main.tsx

```tsx

```

## const queryClient = new QueryClient()

```tsx
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Playlists />
    </QueryClientProvider>
  )
}
```

## add page Playlists

src/pages/playlists/playlists.tsx

```tsx

```

## devtool

pnpm i @tanstack/react-query-devtools

## install tanstack router

pnpm add @tanstack/react-router
pnpm install -D @tanstack/router-plugin

https://tanstack.com/router/latest/docs/framework/react/quick-start

```typescript
tanstackRouter({
  target: 'react',
  autoCodeSplitting: true,
})
```

1. при добавляении 2 страницы.. обратить внимание.. что нет рефетчей..

https://miro.com/app/board/uXjVIhdj_Vw=/?share_link_id=990510541124
