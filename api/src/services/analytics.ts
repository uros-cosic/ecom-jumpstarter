import { PopulatedOrder } from '../models/Order'
import { OrderAnalytics } from '../models/OrderAnalytics'
import { SiteAnalytics } from '../models/SiteAnalytics'

export class AnalyticsService {
    public static updateSignups = async () => {
        try {
            const today = new Date().toISOString().split('T')[0]

            await SiteAnalytics.findOneAndUpdate(
                { date: today },
                {
                    $inc: { newSignups: 1 },
                },
                { upsert: true, new: true }
            )
        } catch (e) {
            console.error(e)
        }
    }

    public static updateOrdersAnalytics = async (order: PopulatedOrder) => {
        try {
            const today = new Date().toISOString().split('T')[0]

            let analytics = await OrderAnalytics.findOne({ date: today })

            if (!analytics) {
                analytics = new OrderAnalytics({
                    date: today,
                    totalOrders: 0,
                    revenue: 0,
                    averageOrderValue: 0,
                })

                analytics.totalOrders += 1
                analytics.revenue += order.cart.totalPrice
                analytics.averageOrderValue =
                    analytics.revenue / analytics.totalOrders

                await analytics.save()
            }
        } catch (e) {
            console.error(e)
        }
    }
}
