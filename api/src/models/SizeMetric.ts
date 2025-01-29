import { model, Schema } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface ISizeMetric extends IBaseModel {
    name: string
    image: string
    metadata: Record<string, string>
}

const SizeMetricSchema = new Schema<ISizeMetric>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            trim: true,
            required: true,
            validate: {
                validator: (val: string) => {
                    try {
                        new URL(val)
                        return true
                    } catch (_) {
                        return false
                    }
                },
                message: 'Invalid thumbnail link',
            },
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

export default model<ISizeMetric>('SizeMetric', SizeMetricSchema)
