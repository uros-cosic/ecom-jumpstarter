import ShippingMethod from '../models/ShippingMethod'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'

export const getShippingMethods = getAll(ShippingMethod)
export const getShippingMethod = getOne(ShippingMethod)
export const createShippingMethod = createOne(ShippingMethod)
export const updateShippingMethod = updateOne(ShippingMethod)
export const deleteShippingMethod = deleteOne(ShippingMethod)
