# Как запустить проект?

1.  В корне проекта запустить (установятся зависимости для всех приложений и пакетов)

```bash
pnpm i
```

2. Затем сбилдить spotifun-api-sdk

```bash
pnpm build:sdk
```

️🔔 Возможно данные скрипты не являются кросc-платформенными

```json
 "scripts": {
    "clean": "rm -rf dist",
    "build": "pnpm run clean && tsc"
  }
```
тогда попробуй альтернативную команду попроще 

```bash
pnpm build:sdk:simple
```

3. Запусти проект 

   1. spotifun на tanstack

    ```bash
     pnpm start:spotifun-tanstack
    ```

   2. spotifun на rtk-query

    ```bash
     pnpm start:spotifun-rtk
    ```

   3. spotifun на nextjs

    ```bash
      pnpm start:spotifun-nextjs
    ```

# Spotifun and trelly apps

## Spotifun

Для того, чтобы запустить `Spotifun` перейдите в директорию `spotifun` и далее смотрите [Readme.md](https://github.com/it-incubator/apihub-front/blob/main/spotifun/README.md)

## Trelly

Для того, чтобы запустить `Trelly` перейдите в директорию `trelly` и далее смотрите [Readme.md](https://github.com/it-incubator/apihub-front/blob/main/trelly/README.md)


