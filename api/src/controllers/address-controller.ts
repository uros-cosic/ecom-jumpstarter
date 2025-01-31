import { NextFunction, Request, Response } from 'express'

import catchAsync from '../lib/catch-async'
import Address from '../models/Address'
import { createOne, getOne } from './handler-factory'
import { AppError } from '../lib/app-error'
import { filterObj } from '../lib/util'
import * as redis from '../services/redis'

export const getAddress = getOne(Address)

export const createAddress = createOne(Address)

export const updateAddress = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user

        if (!user) return next(new AppError(req.t('errors.bad-request'), 400))

        const address = await Address.findById(req.params.id)

        if (!address)
            return next(
                new AppError(
                    req.t('errors.not-found', {
                        field: req.t('words.address'),
                    }),
                    404
                )
            )

        if (String(address.user) !== String(user._id))
            return next(new AppError(req.t('errors.bad-request'), 400))

        const filteredBody = filterObj(
            req.body,
            'company',
            'firstName',
            'lastName',
            'address',
            'city',
            'province',
            'postalCode',
            'phone'
        )

        const newAddress = await Address.findByIdAndUpdate(
            address._id,
            filteredBody,
            {
                new: true,
                runValidators: true,
            }
        )

        await redis.deleteCachedValueByKey(
            `${Address.modelName.toLowerCase()}:${String(address._id)}`
        )

        res.status(200).json({
            data: newAddress,
        })
        return
    }
)

export const deleteAddress = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user

        if (!user) return next(new AppError(req.t('errors.bad-request'), 400))

        const address = await Address.findById(req.params.id)

        if (!address)
            return next(
                new AppError(
                    req.t('errors.not-found', {
                        field: req.t('words.address'),
                    }),
                    404
                )
            )

        if (String(address.user) !== String(user._id))
            return next(new AppError(req.t('errors.bad-request'), 400))

        await Address.findByIdAndDelete(address._id)

        await redis.deleteCachedValueByKey(
            `${Address.modelName.toLowerCase()}:${String(address._id)}`
        )

        res.status(204).json({
            data: null,
        })
        return
    }
)
