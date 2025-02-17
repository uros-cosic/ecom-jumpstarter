"use client"

import { useEffect, useState } from "react"
import { io, Socket } from 'socket.io-client'
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { WS_URL } from "@/lib/constants"
import { WebSocketContext } from "@/lib/context/websocket"
import { IOrder, IUser, LiveDataNotificationEvents } from "@/lib/types"
import { getMe } from "@/lib/data/user"


type Props = {
    children: Readonly<React.ReactNode>
}

const WebsocketProvider = ({ children }: Props) => {
    const [user, setUser] = useState<IUser | null>(null)
    const [webSocket, setWebSocket] = useState<Socket | null>(null)

    const router = useRouter()

    const fetchUser = async () => {
        const data = await getMe()

        if (data) setUser(data)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        if (user) {
            const ws = io(WS_URL, { query: { userId: user._id } })

            setWebSocket(ws)

            ws.on(LiveDataNotificationEvents.ORDER_COMPLETED, (data: IOrder) => {
                toast('New order', {
                    action: {
                        label: 'Review',
                        onClick: () => { router.push(`/orders/${data._id}`) }
                    },
                })
            })

            return () => {
                ws.off(LiveDataNotificationEvents.ORDER_COMPLETED)
                ws.off('connect')
            }
        }

    }, [user, router])

    return (
        <WebSocketContext.Provider value={{ webSocket }}>{children}</WebSocketContext.Provider>
    )
}

export default WebsocketProvider
