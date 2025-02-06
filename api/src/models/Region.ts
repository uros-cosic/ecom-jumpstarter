import { ObjectId, Schema, model } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface IRegion extends IBaseModel {
    name: string
    currency: string
    countries: ObjectId[]
    defaultLocale: string
    taxRate: number
    metadata: Record<string, string>
}

const RegionSchema = new Schema<IRegion>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        countries: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Country',
            },
        ],

        defaultLocale: {
            type: String,
            required: true,
            trim: true,
        },

        currency: {
            type: String,
            required: true,
        },

        taxRate: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        metadata: {
            type: Map,
            of: String,
            default: {},
        },
    },
    {
        timestamps: true,
    }
)

export default model<IRegion>('Region', RegionSchema)
