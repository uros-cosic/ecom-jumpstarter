import { model, ObjectId, Schema } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface IPaymentMethod extends IBaseModel {
    name: string
    region: ObjectId
    metadata: Record<string, string>
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true,
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

export default model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema)
