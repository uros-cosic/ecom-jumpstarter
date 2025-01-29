import { Model, model, Schema } from 'mongoose'
import i18next from 'i18next'

import { AppError } from '../lib/app-error'
import { IBaseModel } from '../lib/types'

export interface IDiscountMethods {
    isValid(): boolean
}

export enum DISCOUNT_TYPE {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
}

type DiscountModel = Model<IDiscount, {}, IDiscountMethods>

export interface IDiscount extends IBaseModel {
    code: string
    type: DISCOUNT_TYPE
    amount?: number
    percentage?: number
    usageLimit: number
    usageCount: number
    validFrom?: Date | null
    validTo?: Date | null
    metadata: Record<string, string>
}

const DiscountSchema = new Schema<IDiscount, DiscountModel, IDiscountMethods>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        type: {
            type: String,
            default: DISCOUNT_TYPE.PERCENTAGE,
            enum: [DISCOUNT_TYPE.PERCENTAGE, DISCOUNT_TYPE.FIXED],
        },

        percentage: {
            type: Number,
            min: 0,
            max: 1,
        },

        amount: {
            type: Number,
            min: 0,
        },

        usageLimit: {
            type: Number,
            default: 1,
            min: 0,
        },

        usageCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        validFrom: Date,

        validTo: Date,

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

DiscountSchema.methods.isValid = function () {
    const now = new Date()

    if (this.validFrom && this.validFrom > now) return false
    if (this.validTo && this.validTo < now) return false
    if (this.usageLimit > 0 && this.usageCount >= this.usageLimit) return false

    return true
}

DiscountSchema.pre('save', function (next) {
    if (this.validFrom && this.validTo && this.validFrom > this.validTo)
        return next(
            new AppError(
                i18next.t('errors.incorrect-field', { field: 'validFrom' }),
                400
            )
        )

    next()
})

export default model<IDiscount, DiscountModel>('Discount', DiscountSchema)
