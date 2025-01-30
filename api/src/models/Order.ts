import { ObjectId, Schema, model } from 'mongoose'

import eventBus from '../services/event-bus'
import { OrderService } from '../services/order'
import Discount from './Discount'
import { IPaymentMethod } from './PaymentMethod'
import { ICart } from './Cart'
import { IBaseModel } from '../lib/types'
import { IAddress } from './Address'
import { IShippingMethod } from './ShippingMethod'
import { StripeService } from '../services/stripe'

export enum AUTOMATED_PAYMENT_METHODS {
    MANUAL = 'manual',
    STRIPE = 'stripe',
}

export enum ORDER_STATUS {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELED = 'canceled',
}

export enum ORDER_FULFILLMENT_STATUS {
    NOT_FULFILLED = 'not fulfilled',
    FULFILLED = 'fulfilled',
    PARTIALLY_FULFILLED = 'partially fulfilled',
    SHIPPED = 'shipped',
    PARTIALLY_SHIPPED = 'partially shipped',
    RETURNED = 'returned',
    PARTIALLY_RETURNED = 'partially returned',
    CANCELED = 'canceled',
}

export interface IOrder extends IBaseModel {
    customer?: ObjectId
    cart: ObjectId
    payment?: ObjectId
    status: ORDER_STATUS
    fulfillmentStatus: ORDER_FULFILLMENT_STATUS
    region: ObjectId
    stripeSessionUrl?: string | null
}

const OrderSchema = new Schema<IOrder>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        cart: {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
            required: true,
        },

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true,
        },

        payment: {
            type: Schema.Types.ObjectId,
            ref: 'Payment',
        },

        status: {
            type: String,
            required: true,
            default: ORDER_STATUS.PENDING,
            enum: {
                values: [
                    ORDER_STATUS.CANCELED,
                    ORDER_STATUS.COMPLETED,
                    ORDER_STATUS.PENDING,
                ],
                message: '{VALUE} is not supported value',
            },
        },

        fulfillmentStatus: {
            type: String,
            required: true,
            default: ORDER_FULFILLMENT_STATUS.NOT_FULFILLED,
            enum: {
                values: [
                    ORDER_FULFILLMENT_STATUS.CANCELED,
                    ORDER_FULFILLMENT_STATUS.FULFILLED,
                    ORDER_FULFILLMENT_STATUS.NOT_FULFILLED,
                    ORDER_FULFILLMENT_STATUS.PARTIALLY_FULFILLED,
                    ORDER_FULFILLMENT_STATUS.PARTIALLY_RETURNED,
                    ORDER_FULFILLMENT_STATUS.PARTIALLY_SHIPPED,
                    ORDER_FULFILLMENT_STATUS.RETURNED,
                    ORDER_FULFILLMENT_STATUS.SHIPPED,
                ],
                message: '{VALUE} is not supported value',
            },
        },

        stripeSessionUrl: String,
    },
    {
        timestamps: true,
    }
)

OrderSchema.pre('save', async function (next) {
    if (!this.isNew) return next()

    await this.populate('cart')
    await this.populate('cart.paymentMethod')

    const paymentMethod = (this.cart as unknown as ICart)
        .paymentMethod as unknown as IPaymentMethod

    const paymentMethodName = paymentMethod?.name.toLowerCase()

    if (paymentMethodName === AUTOMATED_PAYMENT_METHODS.MANUAL) {
        this.status = ORDER_STATUS.COMPLETED
    }

    if (paymentMethodName === AUTOMATED_PAYMENT_METHODS.STRIPE) {
        const sessionUrl = await StripeService.createCheckoutSession(
            this.toObject() as unknown as Omit<IOrder, 'cart'> & { cart: ICart }
        )

        this.stripeSessionUrl = sessionUrl
    }

    next()
})

export type PopulatedOrder = Omit<IOrder, 'cart'> & {
    cart: Omit<ICart, 'address' | 'shippingMethod'> & {
        address: IAddress
        shippingMethod: IShippingMethod
    }
}

OrderSchema.pre('save', async function (next) {
    if (this.status === ORDER_STATUS.COMPLETED) {
        // Populating for order confirmation email
        await Promise.all([
            this.populate('cart'),
            this.populate('cart.address'),
            this.populate('cart.shippingMethod'),
        ])

        // Update discount usage on order completion
        if ((this.cart as unknown as ICart)?.discountCode) {
            const discount = await Discount.findById(
                (this.cart as unknown as ICart)?.discountCode
            )

            if (discount && discount.isValid()) {
                discount.usageCount += 1
                await discount.save()
            }
        }
    }

    next()
})

OrderSchema.pre('save', function (next) {
    if (this.status === ORDER_STATUS.COMPLETED)
        eventBus.emit(OrderService.Events.COMPLETED, this.toObject())
    next()
})

OrderSchema.pre('save', async function (next) {
    if (this.fulfillmentStatus === ORDER_FULFILLMENT_STATUS.FULFILLED) {
        await this.populate('cart')
        eventBus.emit(OrderService.Events.FULFILLED, this.toObject())
    }
    next()
})

export default model<IOrder>('Order', OrderSchema)
