import { model, ObjectId, Schema } from 'mongoose'
import i18next from 'i18next'

import User from './User'
import { AppError } from '../lib/app-error'
import Cart from './Cart'
import Order from './Order'
import { IBaseModel } from '../lib/types'

export interface IProductReview extends IBaseModel {
    product: ObjectId
    customer: ObjectId
    order: ObjectId
    rating: number
    region: ObjectId
    comment?: string
    active: boolean
}

const ProductReviewSchema = new Schema<IProductReview>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },

        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true,
        },

        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            minlength: 5,
            maxlength: 255,
            trim: true,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

ProductReviewSchema.pre('save', async function (next) {
    try {
        const customer = await User.findById(this.customer)

        if (!customer)
            return next(
                new AppError(
                    i18next.t('errors.not-found', { field: 'Customer' })
                )
            )

        const cart = await Cart.findOne({
            customer: this.customer,
            items: {
                $elemMatch: {
                    product: this.product,
                },
            },
        })

        if (!cart) return next(new AppError(i18next.t('errors.bad-request')))

        const order = await Order.findById(this.order)

        if (!order) return next(new AppError(i18next.t('errors.bad-request')))

        next()
    } catch (error: any) {
        next(new AppError(error?.message || i18next.t('errors.default')))
    }
})

export default model<IProductReview>('ProductReview', ProductReviewSchema)
