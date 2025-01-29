import { ObjectId, Document } from 'mongoose'

export interface IBaseModel extends Document {
    _id: ObjectId
    updatedAt: Date
    createdAt: Date
}
