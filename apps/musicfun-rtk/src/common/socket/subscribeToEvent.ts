import type { SocketEvents } from '@/common/constants'
import { getSocket } from './getSocket.ts'
import type { Socket } from 'socket.io-client'

type Callback<T> = (data: T) => void

/**
 * Subscribes to a Socket.IO event and returns an unsubscribe function.
 *
 * @template T Type of the event payload received in the callback
 * @param event Event name from SOCKET_EVENTS
 * @param callback Function executed when the event is received
 * @returns Function that removes the event listener (unsubscribe)
 */
export const subscribeToEvent = <T>(event: SocketEvents, callback: Callback<T>) => {
  const socket: Socket = getSocket()
  socket.on(event, callback)

  return () => {
    socket.off(event, callback)
  }
}
