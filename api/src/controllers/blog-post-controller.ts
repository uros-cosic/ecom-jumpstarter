import { NextFunction, Request, Response } from 'express'
import path from 'path'

import BlogPost from '../models/BlogPost'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handler-factory'
import { AppError } from '../lib/app-error'
import catchAsync from '../lib/catch-async'
import { UploadService } from '../services/upload'
import { generateUniqueFileName } from '../lib/util'

export const getBlogPosts = getAll(BlogPost)
export const getBlogPost = getOne(BlogPost)
export const createBlogPost = createOne(BlogPost)
export const updateBlogPost = updateOne(BlogPost)
export const deleteBlogPost = deleteOne(BlogPost)

export const uploadBlogPostThumbnail = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) return next(new AppError(req.t('errors.no-file'), 400))

        const filePath = await UploadService.uploadImage(
            req.file.buffer,
            path.join('public', 'images', 'blog'),
            generateUniqueFileName(req.file)
        )

        res.status(201).json({ data: filePath })
        return
    }
)
