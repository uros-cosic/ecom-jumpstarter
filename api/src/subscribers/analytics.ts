import { AnalyticsService } from '../services/analytics'
import eventBus from '../services/event-bus'
import { OrderService } from '../services/order'
import { UserService } from '../services/user'

// Users

eventBus.on(UserService.Events.CREATED, async () => {
    AnalyticsService.updateSignups()
})

// Orders

eventBus.on(OrderService.Events.COMPLETED, async (data) => {
    AnalyticsService.updateOrdersAnalytics(data)
})
