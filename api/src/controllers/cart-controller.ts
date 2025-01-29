import { NextFunction, Request, Response } from 'express'

import catchAsync from '../lib/catch-async'
import Cart from '../models/Cart'
import { getOne } from './handler-factory'
import { AppError } from '../lib/app-error'
import { filterObj } from '../lib/util'

export const getCart = getOne(Cart)
export const createCart = catchAsync(async (req: Request, res: Response) => {
    const filteredBody = filterObj(
        req.body,
        'customer',
        'items',
        'address',
        'shippingMethod',
        'paymentMethod',
        'email',
        'discountCode',
        'region'
    )

    const cart = await Cart.create(filteredBody)

    res.status(201).json({
        data: cart,
    })
    return
})

export const updateCart = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const cart = await Cart.findById(req.params.id)

        if (!cart)
            return next(
                new AppError(
                    req.t('errors.not-found', { field: req.t('words.cart') }),
                    404
                )
            )

        const filteredBody = filterObj(
            req.body,
            'customer',
            'items',
            'address',
            'shippingMethod',
            'paymentMethod',
            'email',
            'discountCode',
            'region'
        )

        for (const key of Object.keys(filteredBody)) {
            // @ts-ignore
            cart[key] = filteredBody[key]
        }

        // Trigger pre-save middleware
        await cart.save()

        res.status(200).json({
            data: cart,
        })
        return
    }
)
