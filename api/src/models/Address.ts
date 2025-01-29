import { ObjectId, Schema, model } from 'mongoose'
import i18next from 'i18next'

import User from './User'
import { AppError } from '../lib/app-error'
import { IBaseModel } from '../lib/types'

export interface IAddress extends IBaseModel {
    user?: ObjectId
    company?: string
    firstName: string
    lastName: string
    address: string
    city: string
    country: string
    province?: string
    postalCode: string
    phone: string
}

const AddressSchema = new Schema<IAddress>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        company: {
            type: String,
            trim: true,
            maxlength: 255,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },

        address: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
        },

        city: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
        },

        country: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
        },

        province: {
            type: String,
            trim: true,
            maxlength: 255,
        },

        postalCode: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
    },
    {
        timestamps: true,
    }
)

AddressSchema.pre('save', async function (next) {
    try {
        if (this.user) {
            const user = await User.findById(this.user)

            if (!user)
                return next(
                    new AppError(
                        i18next.t('errors.not-found', {
                            field: i18next.t('words.user'),
                        }),
                        404
                    )
                )
        }
        next()
    } catch (error: any) {
        next(new AppError(error?.message || i18next.t('errors.default')))
    }
})

export default model<IAddress>('Address', AddressSchema)
