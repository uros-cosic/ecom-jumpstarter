import { Model, model, ObjectId, Schema } from 'mongoose'

import { SaleService } from '../services/sale'
import eventBus from '../services/event-bus'
import { IBaseModel } from '../lib/types'

export enum SALE_TYPE {
    FIXED = 'fixed',
    PERCENTAGE = 'percentage',
}

export interface ISale extends IBaseModel {
    name: string
    products: ObjectId[]
    type: SALE_TYPE
    region: ObjectId
    thumbnail: string
    discountPercentage?: number
    discountAmount?: number
    startDate?: Date | null
    endDate?: Date | null
    metadata: Record<string, string>
}

export interface ISaleMethods {
    isActive(): boolean
}

type SaleModel = Model<ISale, {}, ISaleMethods>

const SaleSchema = new Schema<ISale, SaleModel, ISaleMethods>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        ],

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true,
        },

        thumbnail: {
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

        type: {
            type: String,
            default: SALE_TYPE.PERCENTAGE,
            enum: [SALE_TYPE.PERCENTAGE, SALE_TYPE.FIXED],
        },

        discountPercentage: {
            type: Number,
            min: 0,
            max: 1,
        },

        discountAmount: {
            type: Number,
            min: 0,
        },

        startDate: Date,
        endDate: Date,

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

SaleSchema.methods.isActive = function () {
    const now = new Date()

    if (this.startDate && new Date(this.startDate) > now) return false
    if (this.endDate && new Date(this.endDate) < now) return false

    return true
}

SaleSchema.pre('save', function (next) {
    if (this.isNew) eventBus.emit(SaleService.Events.CREATED, this.toObject())
    next()
})

export default model<ISale, SaleModel>('Sale', SaleSchema)
