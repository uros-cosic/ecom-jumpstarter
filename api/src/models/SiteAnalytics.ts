import { Schema, model } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface ISiteAnalytics extends IBaseModel {
    date: Date
    totalVisits: number
    newSignups: number
    geoData: { country: string; visits: number }[]
    deviceData: { deviceType: string }[]
}

const SiteAnalyticsSchema = new Schema<ISiteAnalytics>(
    {
        date: { type: Date, required: true, default: Date.now, unique: true },
        totalVisits: { type: Number, default: 0 },
        newSignups: { type: Number, default: 0 },
        geoData: [{ country: String, visits: Number }],
        deviceData: [{ deviceType: String }],
    },
    { timestamps: true }
)

export const SiteAnalytics = model<ISiteAnalytics>(
    'SiteAnalytics',
    SiteAnalyticsSchema
)
