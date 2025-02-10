import { NextFunction, Request, Response } from 'express'
import catchAsync from '../lib/catch-async'
import Discount from '../models/Discount'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'
import { AppError } from '../lib/app-error'

export const getDiscounts = getAll(Discount)
export const getDiscount = getOne(Discount)
export const createDiscount = createOne(Discount)
export const updateDiscount = updateOne(Discount)
export const deleteDiscount = deleteOne(Discount)

export const getDiscountByCode = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { code } = req.query

        if (!code) return next(new AppError(req.t('errors.bad-request'), 400))

        const discount = await Discount.findOne({ code })

        if (!discount || !discount.isValid()) {
            return next(
                new AppError(
                    req.t('errors.invalid', {
                        field: req.t('words.discount-code'),
                    }),
                    400
                )
            )
        }

        res.status(200).json({ data: discount })
        return
    }
)
