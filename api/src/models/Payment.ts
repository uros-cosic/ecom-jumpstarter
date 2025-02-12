import { ObjectId, Schema, model } from 'mongoose'

import { IBaseModel } from '../lib/types'

export enum PAYMENT_STATUS {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export interface IPayment extends IBaseModel {
    method: ObjectId
    amount: number
    status: PAYMENT_STATUS
}

const PaymentSchema = new Schema<IPayment>(
    {
        method: {
            type: Schema.Types.ObjectId,
            ref: 'PaymentMethod',
            required: true,
        },

        amount: {
            type: Number,
            min: 0,
        },

        status: {
            type: String,
            required: true,
            default: PAYMENT_STATUS.PENDING,
            enum: {
                values: [
                    PAYMENT_STATUS.COMPLETED,
                    PAYMENT_STATUS.FAILED,
                    PAYMENT_STATUS.PENDING,
                ],
                message: '{VALUE} is not supported payment status value',
            },
        },
    },
    {
        timestamps: true,
    }
)

export default model<IPayment>('Payment', PaymentSchema)
