import PaymentMethod from '../models/PaymentMethod'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'

export const getPaymentMethods = getAll(PaymentMethod)
export const getPaymentMethod = getOne(PaymentMethod)
export const createPaymentMethod = createOne(PaymentMethod)
export const updatePaymentMethod = updateOne(PaymentMethod)
export const deletePaymentMethod = deleteOne(PaymentMethod)
