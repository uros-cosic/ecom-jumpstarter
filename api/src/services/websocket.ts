import { isValidObjectId } from 'mongoose'
import { Socket } from 'socket.io'

import '../config'

import * as redis from './redis'
import User, { USER_ROLE } from '../models/User'

export class WebsocketService {
    public static authenticateConnection = async (socket: Socket) => {
        try {
            const userId = socket.handshake.query?.userId

            if (userId && isValidObjectId(userId)) {
                let user

                const cachedUser = await redis.getCachedValue(
                    `${User.modelName.toLowerCase()}:${userId}`
                )

                if (cachedUser) {
                    user = await JSON.parse(cachedUser)
                } else {
                    user = await User.findById(userId)
                }

                if (user && user.role === USER_ROLE.ADMIN) {
                    socket.join(USER_ROLE.ADMIN)
                    return true
                }
                return false
            }
            return false
        } catch (e) {
            console.error(e)
            return false
        }
    }
}
