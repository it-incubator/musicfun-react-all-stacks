import { isRouteErrorResponse, type LoaderFunctionArgs, useLoaderData, useRouteError } from 'react-router'
import { UserPage } from '@/pages/user'

// --- Шаг 1: Определение типа данных ---
// Хорошая практика - определить, как выглядят данные, которые мы ожидаем от API.
interface User {
  id: number
  name: string
  email: string
  avatarUrl: string
  bio: string
}

// --- Шаг 2: Loader - загрузчик данных ---
// Эта функция будет вызвана React Router'ом ПЕРЕД тем, как компонент будет отрендерен.
// Она отвечает за загрузку данных для этой страницы.
export async function loader({ params }: LoaderFunctionArgs): Promise<User> {
  // `params.id` приходит из имени файла `$id.tsx`
  const userId = params.id

  if (!userId) {
    throw new Error('ID пользователя не предоставлен в URL.')
  }

  // Делаем запрос к нашему API
  // Для примера используем публичный API reqres.in
  const response = await fetch(`https://reqres.in/api/users/${userId}`)

  // --- Обработка ошибок в Loader'е ---
  // Это ключевая фича! Если пользователь не найден (404), мы "выбрасываем" ответ.
  // React Router поймает это и отобразит наш ErrorBoundary.
  if (!response.ok) {
    if (response.status === 404) {
      throw new Response('Пользователь не найден', { status: 404 })
    }
    // Для других ошибок сервера
    throw new Response('Ошибка сервера' + '\n' + JSON.stringify(await response.json()), {
      status: 500,
    })
  }

  const { data } = await response.json()

  // Возвращаем данные. Они станут доступны в компоненте через `useLoaderData`.
  return data
}

// --- Шаг 3: Основной компонент страницы ---
// Этот компонент будет отрендерен только ПОСЛЕ успешного выполнения loader'а.
export default function UserPageRoute() {
  // Хук `useLoaderData` предоставляет данные, которые вернул `loader`.
  // Мы можем безопасно типизировать их, так как знаем структуру.
  const user = useLoaderData() as User

  // Не нужно использовать useState, useEffect, проверять на loading...
  // Данные `user` гарантированно существуют на момент рендера.

  return <UserPage user={user} />
}

// --- Шаг 4: Компонент для обработки ошибок (ErrorBoundary) ---
// Этот компонент будет показан, если в `loader` или при рендере `UserPage` произойдет ошибка.
export function ErrorBoundary() {
  const error = useRouteError()

  // isRouteErrorResponse помогает понять, что ошибка - это Response, который мы бросили в loader'е
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    )
  }

  // Для всех остальных, непредвиденных ошибок
  return <h1>Что-то пошло не так!</h1>
}

// --- Шаг 5 (Опционально): Компонент ожидания (Pending Component) ---
// Этот компонент будет показан, пока `loader` выполняет свою работу (например, ждет ответ от сети).
// Это улучшает UX, показывая пользователю, что загрузка идет.
export function PendingComponent() {
  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', opacity: 0.5 }}>
      <div style={{ width: 150, height: 150, borderRadius: '50%', backgroundColor: '#eee' }} />
      <div>
        <h1>Загрузка пользователя...</h1>
        <div style={{ width: 200, height: 20, backgroundColor: '#eee', marginTop: 10 }} />
      </div>
    </div>
  )
}
