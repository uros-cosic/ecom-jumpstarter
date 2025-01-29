import { USER_ROLE } from '../models/User'
import { io } from '../websocket'

export class NotificationService {
    public static notifyAdmins = async (
        event: string,
        data: unknown = null
    ) => {
        try {
            io.to(USER_ROLE.ADMIN).emit(event, data)
        } catch (e) {
            console.error(e)
        }
    }
}
