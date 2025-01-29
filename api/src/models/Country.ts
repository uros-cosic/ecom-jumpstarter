import { model, ObjectId, Schema } from 'mongoose'

import { IBaseModel } from '../lib/types'

export interface ICountry extends IBaseModel {
    name: string
    iso_2: string
    region: ObjectId
}

const CountrySchema = new Schema<ICountry>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        iso_2: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        region: {
            type: Schema.Types.ObjectId,
            ref: 'Region',
        },
    },
    {
        timestamps: true,
    }
)

export default model<ICountry>('Country', CountrySchema)
