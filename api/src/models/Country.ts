import { model, Schema } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface ICountry extends IBaseModel {
    name: string
    code: string
    currency: string
    languages: string[]
}

const CountrySchema = new Schema<ICountry>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },

        currency: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        languages: [
            {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
            },
        ],
    },
    {
        timestamps: true,
    }
)

export default model<ICountry>('Country', CountrySchema)
