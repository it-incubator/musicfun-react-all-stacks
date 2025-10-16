import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { queryClient } from '@/shared/api/query-client/queryClient'
import { KEY_STORAGE } from '@/shared/consts/key-storage/key-storage'

//позволяет сохранять кэш запросов не только в памяти приложения, но и во внешнем хранилище

//Зачем?
// Чтобы при перезапуске приложения или даже при уходе приложения в фон данные запросов не исчезали.
// Пользователь получает более быстрый старт, меньше лишних сетевых запросов, и оффлайн-режим работает лучше.
const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: KEY_STORAGE.RQ_CACHE,
  throttleTime: 1000, //интервал между сохранениями в мс
})

export function setupQueryPersist() {
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 24 * 60 * 60 * 1000, //24 часа
  })
}
