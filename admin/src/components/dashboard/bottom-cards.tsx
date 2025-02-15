import { getOrdersAnalytics, getSiteAnalytics } from "@/lib/data/analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import DevicesPieChart from "./devices-pie-chart"
import { IOrderAnalytics, ISiteAnalytics, RequestQuery } from "@/lib/types"
import SiteVisitsChart from "./site-visits-chart"
import OrdersChart from "./orders-chart"

const BottomCards = async () => {
    const today = new Date().toISOString().split('T')[0]

    const siteAnalytics = await getSiteAnalytics({ date: new Date(today), limit: 1 })

    const devicesData: Record<string, number> = {}

    if (siteAnalytics?.length) {
        siteAnalytics[0].deviceData.forEach(device => {
            devicesData[device.deviceType] = (devicesData[device.deviceType] ?? 0) + 1
        })
    }

    const d = new Date()
    d.setMonth(d.getMonth() - 1)

    const monthlySiteVisits = await getSiteAnalytics({ "date[gte]": d, "fields": "totalVisits,date", "sort": "date" } as RequestQuery<ISiteAnalytics>) as unknown as null | { totalVisits: number, date: Date }[]

    const monthlyOrders = await getOrdersAnalytics({ "date[gte]": d, "fields": "totalOrders,date", "sort": "date" } as RequestQuery<IOrderAnalytics>) as unknown as null | { date: Date, totalOrders: number }[]

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <Card className="xl:col-span-1">
                    <CardHeader>
                        <CardTitle>
                            Sessions by device type
                        </CardTitle>
                        <CardDescription>
                            Showing total visits by device type
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!!Object.keys(devicesData).length ?
                            <div className="flex flex-col gap-10">
                                <DevicesPieChart devicesData={devicesData} />
                                <ul className="flex flex-col gap-2 text-sm mt-10">
                                    {
                                        Object.keys(devicesData).map(key => (
                                            <li key={key} className="flex w-full items-end justify-between gap-2 font-medium">
                                                <span>{key}</span>
                                                <span>{devicesData[key]}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            : <span>No sessions</span>}
                    </CardContent>
                </Card>
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Site visits</CardTitle>
                        <CardDescription>
                            Showing total visitors in the last month
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SiteVisitsChart data={monthlySiteVisits ?? []} />
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                        Showing number of orders in the last month
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <OrdersChart data={monthlyOrders ?? []} />
                </CardContent>
            </Card>
        </div>
    )
}

export default BottomCards
