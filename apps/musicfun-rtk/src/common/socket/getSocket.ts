import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

/**
 * Creates or returns existing WebSocket connection.
 * Implements singleton pattern to avoid multiple connections.
 *
 * @returns {Socket} Socket.IO instance
 */
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      path: '/api/1.0/ws',
      transports: ['websocket'],
    })

    socket.on('connect', () => console.log('✅ Connected to server'))
    socket.on('disconnect', () => console.log('❌ Disconnected from server'))
    socket.on('connect_error', (error) => console.error('⛔ Connection error:', error))
  }
  return socket
}
