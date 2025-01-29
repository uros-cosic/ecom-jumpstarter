import { model, Schema } from 'mongoose'
import slugify from 'slugify'

import { IBaseModel } from '../lib/types'

export interface IProductCollection extends IBaseModel {
    name: string
    description: string
    handle: string
    keywords: string[]
    metadata: Record<string, string>
}

const ProductCollectionSchema = new Schema<IProductCollection>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 60,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 150,
        },

        handle: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
            default: function () {
                const title = this.name

                return slugify(title, {
                    lower: true,
                    strict: true,
                    trim: true,
                })
            },
        },

        keywords: {
            type: [String],
            default: [],
        },

        metadata: {
            type: Map,
            of: String,
        },
    },
    {
        timestamps: true,
    }
)

export default model<IProductCollection>(
    'ProductCollection',
    ProductCollectionSchema
)
