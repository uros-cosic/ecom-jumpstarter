import { model, Schema, ObjectId } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface IShippingMethod extends IBaseModel {
    name: string
    cost: number
    region: ObjectId
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

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model<IShippingMethod>('ShippingMethod', ShippingMethodSchema)
