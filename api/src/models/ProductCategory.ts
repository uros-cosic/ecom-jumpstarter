import { model, ObjectId, Schema } from 'mongoose'
import slugify from 'slugify'

import { IBaseModel } from '../lib/types'

export interface IProductCategory extends IBaseModel {
    name: string
    description: string
    handle: string
    keywords: string[]
    parentCategory?: ObjectId
    region: ObjectId
    metadata: Record<string, string>
}

const ProductCategorySchema = new Schema<IProductCategory>(
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
            unique: true,
            index: true,
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

        parentCategory: {
            type: Schema.Types.ObjectId,
            ref: 'ProductCategory',
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

export default model<IProductCategory>('ProductCategory', ProductCategorySchema)
