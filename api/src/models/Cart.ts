import { Model, model, Schema, ObjectId } from 'mongoose'
import i18next from 'i18next'

import Product from './Product'
import Sale, { SALE_TYPE } from './Sale'
import { AppError } from '../lib/app-error'
import eventBus from '../services/event-bus'
import { CartService } from '../services/cart'
import { IBaseModel } from '../lib/types'
import ShippingMethod from './ShippingMethod'
import Discount, { DISCOUNT_TYPE } from './Discount'

export interface ICartItem extends IBaseModel {
    product: ObjectId
    variant?: ObjectId
    quantity: number
}

export interface ICart extends IBaseModel {
    customer?: ObjectId
    items: ICartItem[]
    region: ObjectId
    address?: ObjectId
    email?: string
    shippingMethod?: ObjectId
    paymentMethod?: ObjectId
    discountCode?: ObjectId
    totalPrice: number
}

interface ICartMethods {
    calculateTotalPrice(): Promise<number>
}

type CartModel = Model<ICart, {}, ICartMethods>

const CartItemSchema = new Schema<ICartItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },

    variant: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant',
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
})

const CartSchema = new Schema<ICart, CartModel, ICartMethods>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        items: [CartItemSchema],

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true,
        },

        address: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
        },

        shippingMethod: {
            type: Schema.Types.ObjectId,
            ref: 'ShippingMethod',
        },

        paymentMethod: {
            type: Schema.Types.ObjectId,
            ref: 'PaymentMethod',
        },

        discountCode: {
            type: Schema.Types.ObjectId,
            ref: 'Discount',
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
            validate: {
                validator: (val: string) => {
                    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        String(val)
                    )
                },
                message: 'Invalid email address',
            },
        },

        totalPrice: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

CartSchema.methods.calculateTotalPrice = async function (): Promise<number> {
    let totalPrice = 0

    for (const item of this.items) {
        const product = await Product.findById(item.product).exec()

        if (!product) continue

        let variant = product.variants?.find(
            (variant) => String(variant._id) === String(item?.variant)
        )

        let price = variant?.price ?? product.price

        // Check if there is an active sale for the product
        const sale = await Sale.findOne({ products: item.product }).exec()

        if (sale && sale.isActive()) {
            if (sale.type === SALE_TYPE.FIXED) price -= sale.discountAmount || 0
            if (sale.type === SALE_TYPE.PERCENTAGE)
                price -= price * (sale.discountPercentage || 0)
        }

        totalPrice += price * item.quantity
    }

    if (this.discountCode) {
        const discount = await Discount.findById(this.discountCode)
        if (discount && discount.isValid()) {
            if (discount.type === DISCOUNT_TYPE.FIXED)
                totalPrice -= discount.amount || 0
            if (discount.type === DISCOUNT_TYPE.PERCENTAGE)
                totalPrice -= totalPrice * (discount.percentage || 0)
        }
    }

    if (this.shippingMethod) {
        const shippingMethod = await ShippingMethod.findById(
            this.shippingMethod
        )
        if (shippingMethod) totalPrice += shippingMethod.cost
    }

    this.totalPrice = parseFloat(Number(Math.max(totalPrice, 0)).toFixed(2))

    return totalPrice
}

CartSchema.pre('save', async function (next) {
    if (this.isNew) {
        eventBus.emit(CartService.Events.CREATED, this.toObject())
    }

    next()
})

CartSchema.pre('save', async function (next) {
    try {
        if (this.isNew || this.isModified('items'))
            await this.calculateTotalPrice()
        next()
    } catch (error: any) {
        next(new AppError(error?.message || i18next.t('errors.default')))
    }
})

CartSchema.pre('findOne', function (next) {
    this.populate('items.product')
    next()
})

export default model<ICart, CartModel>('Cart', CartSchema)
