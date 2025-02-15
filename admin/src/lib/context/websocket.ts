'use client'

import { createContext } from 'react'
import { Socket } from 'socket.io-client'

export type WebSocketContent = {
    webSocket: Socket | null
}

export const WebSocketContext = createContext<WebSocketContent>({
    webSocket: null,
})
