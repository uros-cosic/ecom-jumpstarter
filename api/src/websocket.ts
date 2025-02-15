import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

import { WebsocketService } from './services/websocket'
import LiveDataService from './services/live-data'

import './config'

const PORT = process.env.WS_PORT || 5001

const httpServer = createServer()

export const io = new SocketIOServer(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

io.on('connection', async (socket) => {
    const adminUser = await WebsocketService.authenticateConnection(socket)

    if (!adminUser) LiveDataService.increaseLiveUsers(1)

    socket.on('disconnect', () => {
        if (!adminUser) LiveDataService.increaseLiveUsers(-1)
    })
})

if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(PORT, () => {
        console.log(`WebSocket server running on port ${PORT}`)
    })
}
