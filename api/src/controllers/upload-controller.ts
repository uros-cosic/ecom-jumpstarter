import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'

import catchAsync from '../lib/catch-async'
import { AppError } from '../lib/app-error'
import { UploadService } from '../services/upload'
import { generateUniqueFileName } from '../lib/util'

const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 * 10 }, // 100MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp|gif/
        const extName = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        )
        const mimeType = fileTypes.test(file.mimetype)

        if (extName && mimeType) {
            cb(null, true)
        } else {
            cb(new Error(req.t('errors.allowed-image-formats')))
        }
    },
})

export const uploadImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) return next(new AppError(req.t('errors.no-file'), 400))

        const filePath = await UploadService.uploadImage(
            req.file.buffer,
            path.join('public', 'images', 'uploads'),
            generateUniqueFileName(req.file)
        )

        res.status(201).json({ data: filePath })
        return
    }
)

export default upload
