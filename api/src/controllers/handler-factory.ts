import { NextFunction, Request, Response } from 'express'
import { Model, PopulateOptions } from 'mongoose'

import catchAsync from '../lib/catch-async'
import { AppError } from '../lib/app-error'
import { APIFeatures } from '../lib/api-features'
import * as redis from '../services/redis'

export const getOne = (
    Model: Model<any>,
    populateOptions:
        | null
        | PopulateOptions
        | (string | PopulateOptions)[] = null
) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            let query = Model.findById(req.params.id)
            const modelName = Model.modelName.toLowerCase()

            if (populateOptions) query = query.populate(populateOptions)
            else {
                const cachedUser = await redis.getCachedValue(
                    `${modelName}:${req.params.id}`
                )

                try {
                    if (cachedUser) {
                        return res
                            .status(200)
                            .json({ data: await JSON.parse(cachedUser) })
                    }
                } catch (_) {}
            }

            const doc = await query

            if (!doc)
                return next(new AppError(req.t('errors.no-document'), 404))

            if (!populateOptions) {
                await redis.setCachedValue(
                    `${modelName}:${req.params.id}`,
                    JSON.stringify(doc.toObject()),
                    30 * 60
                )
            }

            return res.status(200).json({
                data: doc,
            })
        }
    )
}

export const getAll = (Model: Model<any>) => {
    return catchAsync(async (req: Request, res: Response) => {
        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        const doc = await features.query

        return res.status(200).json({
            data: doc,
        })
    })
}

export const createOne = (Model: Model<any>) => {
    return catchAsync(async (req: Request, res: Response) => {
        const doc = await Model.create(req.body)
        return res.status(201).json({
            data: doc,
        })
    })
}

export const updateOne = (Model: Model<any>) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            })

            if (!doc)
                return next(new AppError(req.t('errors.no-document'), 404))

            try {
                await redis.deleteCachedValueByKey(
                    `${Model.modelName.toLowerCase()}:${req.params.id}`
                )
            } catch (_) {}

            return res.status(200).json({
                data: doc,
            })
        }
    )
}

export const deleteOne = (Model: Model<any>) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const doc = await Model.findByIdAndDelete(req.params.id)

            if (!doc)
                return next(new AppError(req.t('errors.no-document'), 404))

            try {
                await redis.deleteCachedValueByKey(
                    `${Model.modelName.toLowerCase()}:${req.params.id}`
                )
            } catch (_) {}

            return res.status(204).json({
                data: null,
            })
        }
    )
}
