import { model, ObjectId, Schema } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface IRefreshToken extends IBaseModel {
    token: string
    user: ObjectId
    expiresAt: Date
    revokedAt?: Date | null
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },

        expiresAt: {
            type: Date,
            required: true,
            default: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },

        revokedAt: Date,
    },
    { timestamps: true }
)

export default model<IRefreshToken>('RefreshToken', RefreshTokenSchema)
