import { NextFunction, Request, Response } from 'express'

import ProductReview from '../models/ProductReview'
import { deleteOne, getAll, getOne, updateOne } from './handler-factory'
import catchAsync from '../lib/catch-async'
import { filterObj } from '../lib/util'
import { AppError } from '../lib/app-error'

export const getProductReviews = getAll(ProductReview)
export const getProductReview = getOne(ProductReview)
export const createProductReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const customer = res.locals.user
        const filteredBody = filterObj(
            req.body,
            'region',
            'comment',
            'rating',
            'order',
            'product'
        )

        const existingReview = await ProductReview.findOne({
            order: filteredBody.order,
            product: filteredBody.product,
        })

        if (existingReview) {
            return next(
                new AppError(
                    req.t('errors.already-exists', {
                        field: req.t('words.review'),
                    }),
                    400
                )
            )
        }

        const productReview = await ProductReview.create({
            ...filteredBody,
            customer,
        })

        res.status(201).json({
            data: productReview,
        })
        return
    }
)
export const updateProductReview = updateOne(ProductReview)
export const deleteProductReview = deleteOne(ProductReview)
