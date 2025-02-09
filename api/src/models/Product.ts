import { model, ObjectId, Schema } from 'mongoose'
import { JSDOM } from 'jsdom'
import slugify from 'slugify'
import DOMPurify from 'dompurify'
import i18next from 'i18next'

import { IBaseModel } from '../lib/types'
import { AppError } from '../lib/app-error'
import eventBus from '../services/event-bus'
import { ProductService } from '../services/product'

export enum PRODUCT_TYPE {
    DIGITAL = 'digital',
    SERVICE = 'service',
    PRODUCT = 'product',
}

export interface IProduct extends IBaseModel {
    name: string
    description: string
    details?: string
    keywords: string[]
    handle: string
    type: PRODUCT_TYPE
    thumbnail: string
    images: string[]
    productCategory?: ObjectId
    productCollection?: ObjectId
    options?: IProductOptions[]
    variants?: IProductVariant[]
    region: ObjectId
    sizeGuide?: ObjectId
    price: number
    quantity: number
    active: boolean
    metadata: Record<string, string>
}

export interface IProductOptions extends IBaseModel {
    name: string
    values: string[]
}

export interface IProductOption extends IBaseModel {
    name: string
    value: string
}

export interface IProductVariant extends IBaseModel {
    title: string
    options: IProductOption[]
    sku?: string
    barcode?: string
    ean?: string
    upc?: string
    hsCode?: string
    midCode?: string
    originCountry?: string
    weight?: string
    length?: string
    height?: string
    width?: string
    material?: string
    price: number
    quantity: number
}

const ProductOptionsSchema = new Schema<IProductOptions>({
    name: {
        type: String,
        required: true,
    },

    values: [
        {
            type: String,
            required: true,
        },
    ],
})

const ProductOptionSchema = new Schema<IProductOption>({
    name: {
        type: String,
        required: true,
    },

    value: {
        type: String,
        required: true,
    },
})

const ProductVariantSchema = new Schema<IProductVariant>({
    title: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    barcode: { type: String, trim: true },
    ean: { type: String, trim: true },
    upc: { type: String, trim: true },
    hsCode: { type: String, trim: true },
    midCode: { type: String, trim: true },
    originCountry: { type: String, trim: true },
    weight: { type: Number, min: 0 },
    length: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    material: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 1 },
    options: [ProductOptionSchema],
})

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 60,
        },

        handle: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            default: function () {
                const title = this.name

                return slugify(title, {
                    lower: true,
                    strict: true,
                    trim: true,
                })
            },
            index: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 150,
        },

        details: String,

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

        images: [
            {
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
                    message: 'Invalid image link',
                },
            },
        ],

        keywords: {
            type: [String],
            default: [],
        },

        productCategory: {
            type: Schema.Types.ObjectId,
            ref: 'ProductCategory',
        },

        productCollection: {
            type: Schema.Types.ObjectId,
            ref: 'ProductCollection',
        },

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true,
        },

        type: {
            type: String,
            required: true,
            enum: {
                values: [
                    PRODUCT_TYPE.DIGITAL,
                    PRODUCT_TYPE.PRODUCT,
                    PRODUCT_TYPE.SERVICE,
                ],
                message: '{VALUE} is not valid product type value',
            },
        },

        sizeGuide: {
            type: Schema.Types.ObjectId,
            ref: 'SizeMetric',
        },

        variants: [ProductVariantSchema],
        options: [ProductOptionsSchema],

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: { type: Number, required: true, min: 0, default: 1 },

        active: {
            type: Boolean,
            default: true,
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

const window = new JSDOM('').window
const purify = DOMPurify(window)

ProductSchema.pre('save', function (next) {
    try {
        if (this.details) this.details = purify.sanitize(this.details)
        next()
    } catch (error: any) {
        next(new AppError(i18next.t('errors.default')))
    }
})

ProductSchema.pre('save', function (next) {
    if (this.isNew)
        eventBus.emit(ProductService.Events.CREATED, this.toObject())
    next()
})

export default model<IProduct>('Product', ProductSchema)
