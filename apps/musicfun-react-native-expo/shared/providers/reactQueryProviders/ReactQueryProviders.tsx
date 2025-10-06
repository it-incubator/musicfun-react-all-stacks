import { PropsWithChildren, useEffect } from 'react'
import { AppState } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query'
import { setupQueryPersist } from '@/shared/api/query-persist/query-presist'
import { queryClient } from '@/shared/api/query-client/queryClient'

setupQueryPersist()

export function ReactQueryProvider({ children }: PropsWithChildren) {
  //имитирует «фокус окна» браузера для мобильного приложения.

  //focusManager.setFocused(true) — для React Query это означает
  // «приложение на переднем плане»: можно возобновлять фоновые процессы, разрешать рефетчи «на фокусе» и т.п.
  //focusManager.setFocused(false) — «в фоне»: пауза некоторых операций (например, повторов), уважение опций наподобие refetchOnWindowFocus.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      console.log('[AppState]', state)
      focusManager.setFocused(state === 'active')
    })
    return () => sub.remove()
  }, [])

  //Сообщает React Query текущий статус «онлайн/офлайн».
  //Когда offline: остановятся ретраи, не будут стартовать новые фетчи.
  // Когда online: запросы с refetchOnReconnect: true автоматически обновятся.
  useEffect(() => {
    return onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((s) => {
        const online = !!(s.isConnected && s.isInternetReachable)
        console.log('[NetInfo]', {
          online,
          type: s.type,
          isConnected: s.isConnected,
          isInternetReachable: s.isInternetReachable,
        })
        setOnline(online)
      }),
    )
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
