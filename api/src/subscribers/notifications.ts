import eventBus from '../services/event-bus'
import { LiveDataService } from '../services/live-data'
import { NotificationService } from '../services/notification'
import { OrderService } from '../services/order'

// Orders

eventBus.on(OrderService.Events.COMPLETED, (data) => {
    NotificationService.notifyAdmins(OrderService.Events.COMPLETED, data)
})

// Live data

eventBus.on(LiveDataService.Events.UPDATED, (data) => {
    NotificationService.notifyAdmins(LiveDataService.Events.UPDATED, data)
})
