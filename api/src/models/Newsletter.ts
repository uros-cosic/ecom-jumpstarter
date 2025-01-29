import { model, ObjectId, Schema } from 'mongoose'

import { NewsletterService } from '../services/newsletter'
import eventBus from '../services/event-bus'
import { IBaseModel } from '../lib/types'

export interface INewsletter extends IBaseModel {
    email: string
    region: ObjectId
    canceledAt?: Date | null
    active: boolean
}

const NewsletterSchema = new Schema<INewsletter>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (val: string) => {
                    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        String(val)
                    )
                },
                message: 'Invalid email',
            },
        },

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
            required: true,
        },

        canceledAt: Date,

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

NewsletterSchema.pre('save', function (next) {
    if (this.isNew)
        eventBus.emit(NewsletterService.Events.CREATED, this.toObject())
    next()
})

NewsletterSchema.pre('save', function (next) {
    if (this.active === false) this.canceledAt = new Date()
    else this.canceledAt = null
    next()
})

export default model<INewsletter>('Newsletter', NewsletterSchema)
