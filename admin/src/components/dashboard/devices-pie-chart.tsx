"use client"

import { Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

type Props = {
    devicesData: Record<string, number>
}

const DevicesPieChart = ({ devicesData }: Props) => {
    const [chartData, setChartData] = useState<{ device: string; visits: number; fill: string }[]>([])
    const [chartConfig, setChartConfig] = useState<ChartConfig>({})

    useEffect(() => {
        const chartData = Object.keys(devicesData).map(key => (
            { device: key, visits: devicesData[key], fill: '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0') }
        ))

        setChartData(chartData)

        const chartConfig: ChartConfig = {}

        Object.keys(devicesData).forEach(key => {
            chartConfig[key as keyof typeof chartConfig] = {
                label: key,
                color: chartData.find(d => d.device === key)!.fill
            }
        })

        setChartConfig(chartConfig)
    }, [devicesData])

    return (
        <div className="flex-1 pb-0">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
            >
                <PieChart>
                    <Pie data={chartData} dataKey="visits" />
                    <ChartLegend
                        content={<ChartLegendContent nameKey="device" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                </PieChart>
            </ChartContainer>
        </div>
    )
}

export default DevicesPieChart
