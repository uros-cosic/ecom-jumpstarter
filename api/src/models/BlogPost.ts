import { ObjectId, Schema, model } from 'mongoose'
import slugify from 'slugify'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import i18next from 'i18next'
import { marked } from 'marked'

import { AppError } from '../lib/app-error'
import { IBaseModel } from '../lib/types'

export interface IBlogPost extends IBaseModel {
    title: string
    description: string
    handle: string
    content: string
    contentMarkdown: string
    thumbnail: string
    region: ObjectId
    author?: ObjectId
    keywords: string[]
    metadata: Record<string, string>
}

const BlogPostSchema = new Schema<IBlogPost>(
    {
        title: {
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

        handle: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            default: function () {
                const title = this.title

                return slugify(title, {
                    lower: true,
                    strict: true,
                    trim: true,
                })
            },
        },

        content: {
            type: String,
            required: true,
        },

        contentMarkdown: {
            type: String,
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true,
        },

        keywords: {
            type: [String],
            default: [],
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

BlogPostSchema.pre('save', async function (next) {
    try {
        this.contentMarkdown = this.content
        this.content = purify.sanitize(await marked(this.content))
        next()
    } catch (error) {
        next(new AppError(String(error) || i18next.t('errors.default')))
    }
})

export default model<IBlogPost>('BlogPost', BlogPostSchema)
