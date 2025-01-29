import ProductCollection from '../models/ProductCollection'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'

export const getProductCollections = getAll(ProductCollection)
export const getProductCollection = getOne(ProductCollection)
export const createProductCollection = createOne(ProductCollection)
export const updateProductCollection = updateOne(ProductCollection)
export const deleteProductCollection = deleteOne(ProductCollection)
