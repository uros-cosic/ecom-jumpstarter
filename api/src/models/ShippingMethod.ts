import { model, Schema } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface IShippingMethod extends IBaseModel {
    name: string
    cost: number
}

const ShippingMethodSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        cost: {
            type: Number,
            min: 0,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model<IShippingMethod>('ShippingMethod', ShippingMethodSchema)
