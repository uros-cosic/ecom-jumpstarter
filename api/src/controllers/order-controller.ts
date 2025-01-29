import { Request, Response } from 'express'

import Order from '../models/Order'
import { getAll, getOne, updateOne } from './handler-factory'
import catchAsync from '../lib/catch-async'
import { filterObj } from '../lib/util'

export const getOrders = getAll(Order)
export const getOrder = getOne(Order)
export const createOrder = catchAsync(async (req: Request, res: Response) => {
    const filteredBody = filterObj(req.body, 'customer', 'cart', 'payment')

    const order = await Order.create(filteredBody)

    res.status(201).json({
        data: order,
    })
    return
})
export const updateOrder = updateOne(Order)

export const getMyLatestOrders = catchAsync(
    async (_req: Request, res: Response) => {
        const user = res.locals.user!

        const orders = await Order.find({ customer: user._id })
            .limit(5)
            .sort({ createdAt: 'desc' })

        res.status(200).json({
            data: orders,
        })
        return
    }
)
