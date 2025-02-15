import { getOrdersAnalytics, getSiteAnalytics } from "@/lib/data/analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import LiveUsersContent from "./live-users-content"
import { formatCurrency } from "@/lib/utils"
import { currency, locale } from "@/lib/constants"

const TopCards = async () => {
    const today = new Date().toISOString().split('T')[0]

    const siteAnalytics = await getSiteAnalytics({ date: new Date(today), limit: 1 })
    const ordersAnalytics = await getOrdersAnalytics({ date: new Date(today), limit: 1 })

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            <Card>
                <CardHeader>
                    <CardTitle>Live users</CardTitle>
                    <CardDescription>Number of users currently on the site</CardDescription>
                </CardHeader>
                <CardContent>
                    <LiveUsersContent />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total visits</CardTitle>
                    <CardDescription>Total number of site visits</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative flex justify-end mt-10">
                        <p className="text-4xl">
                            {(siteAnalytics && siteAnalytics.length) ? siteAnalytics[0].totalVisits : 0}
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total revenue</CardTitle>
                    <CardDescription>Total revenue of today</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative flex justify-end mt-10">
                        <p className="text-4xl">
                            {(ordersAnalytics && ordersAnalytics.length) ? formatCurrency(locale, currency, ordersAnalytics[0].revenue) : formatCurrency(locale, currency, 0)}
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Number of orders made today</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative flex justify-end mt-10">
                        <p className="text-4xl">
                            {(ordersAnalytics && ordersAnalytics.length) ? ordersAnalytics[0].totalOrders : 0}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default TopCards
