import Region from '../models/Region'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'

export const getRegions = getAll(Region)
export const getRegion = getOne(Region)
export const createRegion = createOne(Region)
export const updateRegion = updateOne(Region)
export const deleteRegion = deleteOne(Region)
