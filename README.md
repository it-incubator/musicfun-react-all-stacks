# Информация

## 🔗 Ссылки

### 💅 Design

- [spotifun](https://www.figma.com/design/AxTPd4AS8oAgdEF4dDgLis/SpotiFun?node-id=9-353&p=f&t=1ALRBVorkExUf8ed-0)

### 📗 Swagger

- [spotifun](https://spotifun.it-incubator.app/api)
- [trelly](https://trelly.it-incubator.app/api)

## 🚀 Запуск проекта

### 1. Установка зависимостей

В корне проекта запустить (установятся зависимости для всех приложений и пакетов)

```bash
pnpm i
```

### 2. SDK build

Затем сбилдить `spotifun-api-sdk`

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

### 3. Старт проекта

- 🎶spotifun на **tanstack**

```bash
   pnpm start:spotifun-tanstack
```

- 🎶spotifun на **rtk-query**

```bash
    pnpm start:spotifun-rtk
```

- 🎶spotifun на **nextjs**

```bash
     pnpm start:spotifun-nextjs
```

- 📊 trelly на **rtk-query**

```bash
     pnpm start:start:trelly-rtk
```

Happy hacking 🚀

## 🔗 Настройки

### 🕎 Переменные окружения

В файле `.env` замените `VITE_API_KEY` который нужно взять из [Api hub](https://apihub.it-incubator.io/en)

### 🅿️ Prettier

❗Обязательно включите в настройках Webstorm `prettier`
