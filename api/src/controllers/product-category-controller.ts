import ProductCategory from '../models/ProductCategory'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'

export const getProductCategories = getAll(ProductCategory)
export const getProductCategory = getOne(ProductCategory)
export const createProductCategory = createOne(ProductCategory)
export const updateProductCategory = updateOne(ProductCategory)
export const deleteProductCategory = deleteOne(ProductCategory)
