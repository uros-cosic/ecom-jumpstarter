"use client"

import { WebSocketContent, WebSocketContext } from "@/lib/context/websocket"
import { LiveDataNotificationEvents } from "@/lib/types"
import { useContext, useEffect, useState } from "react"

const LiveUsersContent = () => {
    const [liveUsers, setLiveUsers] = useState(0)
    const { webSocket } = useContext<WebSocketContent>(WebSocketContext)

    useEffect(() => {
        if (webSocket) {
            webSocket.on(LiveDataNotificationEvents.LIVE_DATA_UPDATED, (data: { users: number }) => {
                setLiveUsers(data.users)
            })

            return () => {
                webSocket.off(LiveDataNotificationEvents.LIVE_DATA_UPDATED)
            }
        }
    }, [webSocket])

    return (
        <div className="relative flex justify-end mt-10">
            <p className="text-4xl">{liveUsers}</p>
            <div className="absolute top-0 left-full h-2 w-2 animate-pulse -translate-x-1/2 bg-green-500 rounded-full" />
        </div>
    )
}

export default LiveUsersContent
