import Discount from '../models/Discount'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'

export const getDiscounts = getAll(Discount)
export const getDiscount = getOne(Discount)
export const createDiscount = createOne(Discount)
export const updateDiscount = updateOne(Discount)
export const deleteDiscount = deleteOne(Discount)
