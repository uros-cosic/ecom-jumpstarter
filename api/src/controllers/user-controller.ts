import { NextFunction, Request, Response } from 'express'
import geoip from 'geoip-lite'
import useragent from 'useragent'

import { getAll, getOne, createOne, updateOne } from './handler-factory'
import catchAsync from '../lib/catch-async'
import { filterObj } from '../lib/util'
import User from '../models/User'
import { AppError } from '../lib/app-error'
import { SiteAnalytics } from '../models/SiteAnalytics'
import * as redis from '../services/redis'

export const getMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        req.params.id = res.locals.user?.id
        next()
    }
)

export const updateMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const filteredBody = filterObj(
            req.body,
            'name',
            'address',
            'cart',
            'email'
        )

        const updatedUser = await User.findByIdAndUpdate(
            res.locals.user?.id,
            filteredBody,
            {
                runValidators: true,
                new: true,
            }
        )

        if (!updatedUser)
            return next(
                new AppError(
                    req.t('errors.not-found', { field: req.t('words.user') }),
                    404
                )
            )

        await redis.deleteCachedValueByKey(
            `${User.modelName.toLowerCase()}:${String(updatedUser._id)}`
        )

        res.status(200).json({
            data: updatedUser,
        })
        return
    }
)

export const getUser = getOne(User)
export const getUsers = getAll(User)
export const createUser = createOne(User)
export const updateUser = updateOne(User)
export const deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findByIdAndUpdate(req.params.id, {
            active: false,
        })

        if (!user)
            return next(
                new AppError(
                    req.t('errors.not-found', { field: req.t('words.user') }),
                    404
                )
            )

        await redis.deleteCachedValueByKey(
            `${User.modelName.toLowerCase()}:${String(user._id)}`
        )

        res.status(204).json({
            data: null,
        })
        return
    }
)

export const trackUser = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        const today = new Date().toISOString().split('T')[0]
        const userIp =
            req.ip ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress
        const userAgent = req.headers['user-agent'] || ''

        const geoData = geoip.lookup(String(userIp)) || {
            country: 'unknown',
            region: 'unknown',
        }

        const agent = useragent.parse(userAgent)
        const deviceType = agent.device.family || 'Unknown'
        const browser = agent.toAgent()

        await SiteAnalytics.findOneAndUpdate(
            { date: today },
            {
                $inc: { totalVisits: 1 },
                $push: {
                    geoData: {
                        country: geoData.country,
                        region: geoData.region,
                    },
                    deviceData: { deviceType, browser },
                },
            },
            { upsert: true, new: true }
        )

        next()
    } catch (error) {
        console.error('Error tracking user analytics:', error)
        next() // Don't block the request even if analytics tracking fails
    }
}
