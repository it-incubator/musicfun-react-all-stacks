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

Happy hacking 🚀
