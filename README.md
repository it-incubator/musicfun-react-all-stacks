[Figma](https://www.figma.com/design/AxTPd4AS8oAgdEF4dDgLis/MusicFun?node-id=9-353&p=f&t=I0svXbRE8kPWOUFB-0) • [ApiHub](https://apihub.it-incubator.io/en) • [Swagger](https://musicfun.it-incubator.app/api)


# 🚀 Project Launch

Information on launching projects can be found in the `README.md` of each individual repository.

## Actual projects

- `youtube/rtk-query` - youtube lessons: rtk-query

- `youtube/tanstack-query-router-fsd` - youtube lessons: tanstack-query

- `apps/musicfun-ui-vanilla` - full project html/css/storybook vanilla without ui libraries

- `apps/musicfun-tanstack-query` - full project with tanstack query

- `apps/musicfun-rtk-query` - full project with rtk-query

## ❌ Project Launch with SDK (Currently Unsupported)

### 1. Installing Dependencies

Run the following command in the project root (this will install dependencies for all apps and packages):

```bash
pnpm i
```

### 2. SDK build

Then build `musicfun-api-sdk`

```bash
pnpm build:sdk
```

️⚠️ Note: Some scripts may not be cross-platform compatible:

```json
"scripts": {
"clean": "rm -rf dist",
"build": "pnpm run clean && tsc"
}
```

If so, try a simpler alternative command:

```bash
pnpm build:sdk:simple
```

### 3. Starting the Project

- 🎶musicfun на **tanstack**

```bash
   pnpm start:musicfun-tanstack
```

- 🎶musicfun на **rtk-query**

```bash
    pnpm start:musicfun-rtk
```

- 🎶musicfun на **nextjs**

```bash
     pnpm start:musicfun-nextjs
```

## ✅ Рекомендованные форматы нейминга файлов в React/TypeScript проектах

| Category              | Recommended Format | Example                               |
| --------------------- | ------------------ | ------------------------------------- |
| **Components**        | `PascalCase`       | `UserCard.tsx`                        |
| **Hooks**             | `camelCase`        | `useAuth.ts`                          |
| **Utilities (utils)** | `kebab-case`       | `format-date.ts`, `validate-email.ts` |
| **Redux Slice/State** | `kebab-case`       | `auth-slice.ts`, `user-slice.ts`      |
| **API files**         | `kebab-case`       | `playlists-api.ts`, `auth-api.ts`     |
| **Types/Interfaces**  | `kebab-case`       | `user.types.ts`, `auth.types.ts`      |
| **Services**          | `kebab-case`       | `auth-service.ts`, `user-service.ts`  |
| **Mocks (mock data)** | `kebab-case`       | `user-mocks.ts`, `playlist-mocks.ts`  |

## Contributing

Please refer to our [Contributing guide](CONTRIBUTING.md) to learn about our development process, how to propose bugfixes 

### Happy hacking 🚀 🚀🚀
