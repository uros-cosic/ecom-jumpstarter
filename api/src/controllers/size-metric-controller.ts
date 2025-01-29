import { NextFunction, Request, Response } from 'express'
import path from 'path'

import SizeMetric from '../models/SizeMetric'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'
import { generateUniqueFileName } from '../lib/util'
import { AppError } from '../lib/app-error'
import catchAsync from '../lib/catch-async'
import { UploadService } from '../services/upload'

export const getSizeMetrics = getAll(SizeMetric)
export const getSizeMetric = getOne(SizeMetric)
export const createSizeMetric = createOne(SizeMetric)
export const updateSizeMetric = updateOne(SizeMetric)
export const deleteSizeMetric = deleteOne(SizeMetric)

export const uploadSizeMetricImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) return next(new AppError(req.t('errors.no-file'), 400))

        const filePath = await UploadService.uploadImage(
            req.file.buffer,
            path.join('public', 'images', 'size-metric'),
            generateUniqueFileName(req.file)
        )

        res.status(201).json({ data: filePath })
        return
    }
)
