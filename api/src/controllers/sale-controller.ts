import { NextFunction, Request, Response } from 'express'
import path from 'path'

import catchAsync from '../lib/catch-async'
import Sale from '../models/Sale'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'
import { AppError } from '../lib/app-error'
import { UploadService } from '../services/upload'
import { generateUniqueFileName } from '../lib/util'

export const getSales = getAll(Sale)
export const getSale = getOne(Sale)
export const createSale = createOne(Sale)
export const updateSale = updateOne(Sale)
export const deleteSale = deleteOne(Sale)

export const uploadSaleThumbnail = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) return next(new AppError(req.t('errors.no-file'), 400))

        const filePath = await UploadService.uploadImage(
            req.file.buffer,
            path.join('public', 'images', 'sale'),
            generateUniqueFileName(req.file)
        )

        res.status(201).json({ data: filePath })
        return
    }
)
