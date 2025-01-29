import Country from '../models/Country'
import { getAll, getOne } from './handler-factory'

export const getCountries = getAll(Country)
export const getCountry = getOne(Country)
