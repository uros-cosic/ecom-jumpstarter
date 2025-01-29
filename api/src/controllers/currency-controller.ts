import Currency from '../models/Currency'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'

export const getCurrencies = getAll(Currency)
export const getCurrency = getOne(Currency)
export const createCurrency = createOne(Currency)
export const updateCurrency = updateOne(Currency)
export const deleteCurrency = deleteOne(Currency)
