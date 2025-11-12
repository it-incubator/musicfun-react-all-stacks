import type { Nullable } from '@/common/types'
import { io, Socket } from 'socket.io-client'

let sharedSocket: Nullable<Socket> = null

const BASE = import.meta.env.VITE_BASE_URL.replace('api/1.0', '')
const PATH = '/api/1.0/ws'

/** создать новый socket с (или без) токена */
function createSocket(token: Nullable<string>): Socket {
  return io(BASE, {
    path: PATH,
    transports: ['websocket'],
    ...(token ? { auth: { token } } : {}),
  })
}

/** получить singleton-сокет (гость, если токена нет) */
export function getSharedSocket(token: Nullable<string>): Socket {
  if (!sharedSocket) sharedSocket = createSocket(token)
  return sharedSocket
}

/**
 * вызвать после логина / логаута.
 * – token === null  → переключаемся на гостевой сокет
 * – token === 'XXX' → подключаемся авторизованно
 */
export function resetSocketWithToken(token: Nullable<string>): Socket {
  // аккуратно рвём старое соединение
  if (sharedSocket) {
    sharedSocket.disconnect()
  }

  sharedSocket = createSocket(token)
  return sharedSocket
}
