import { Schema, model } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface IOrderAnalytics extends IBaseModel {
    date: Date
    totalOrders: number
    revenue: number
    averageOrderValue: number
}

const OrderAnalyticsSchema = new Schema<IOrderAnalytics>(
    {
        date: { type: Date, required: true, default: Date.now, unique: true },
        totalOrders: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },
        averageOrderValue: { type: Number, default: 0 },
    },
    { timestamps: true }
)

export const OrderAnalytics = model<IOrderAnalytics>(
    'OrderAnalytics',
    OrderAnalyticsSchema
)
