import Payment from '../models/Payment'
import { createOne, getAll, getOne, updateOne } from './handler-factory'

export const getPayments = getAll(Payment)
export const getPayment = getOne(Payment)
export const createPayment = createOne(Payment)
export const updatePayment = updateOne(Payment)
