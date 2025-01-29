import { Schema, model } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface ICurrency extends IBaseModel {
    name: string
    code: string
    symbol: string
}

const CurrencySchema = new Schema<ICurrency>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        symbol: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model<ICurrency>('Currency', CurrencySchema)
