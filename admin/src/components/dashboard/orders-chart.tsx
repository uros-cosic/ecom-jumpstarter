"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { formatDate } from "@/lib/utils"
import { locale } from "@/lib/constants"

const chartConfig = {
    totalOrders: {
        label: "Total orders",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

type Props = {
    data: { date: Date, totalOrders: number }[]
}

const OrdersChart = ({ data }: Props) => {
    return (
        <ChartContainer config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={"date"}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => formatDate(value, locale)}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            indicator="line"
                            labelFormatter={value => formatDate(value, locale)}
                        />
                    }
                />
                <Area
                    dataKey="totalOrders"
                    type="natural"
                    fill="#7FFFD4"
                    fillOpacity={0.4}
                    stroke="#088F8F"
                />
            </AreaChart>
        </ChartContainer>
    )
}

export default OrdersChart

