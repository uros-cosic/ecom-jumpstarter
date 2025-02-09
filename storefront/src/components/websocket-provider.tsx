"use client"

import { useEffect, useState } from "react"
import { io, Socket } from 'socket.io-client'

import { WS_URL } from "@/lib/constants"
import { WebSocketContext } from "@/lib/context/websocket"


type Props = {
    children: Readonly<React.ReactNode>
}

const WebsocketProvider = ({ children }: Props) => {
    const [webSocket, setWebSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const ws = io(WS_URL)

        setWebSocket(ws)

        return () => {
            ws.off('connect')
        }
    }, [])

    return (
        <WebSocketContext.Provider value={{ webSocket }}>{children}</WebSocketContext.Provider>
    )
}

export default WebsocketProvider
