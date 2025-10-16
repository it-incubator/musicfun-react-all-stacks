import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      path: '/api/1.0/ws',
      transports: ['websocket'],
    })

    socket.on('connect', () => console.log('✅ Connected to server'))
    socket.on('disconnect', () => console.log('❌ Connection destroyed'))
  }

  return socket
}
