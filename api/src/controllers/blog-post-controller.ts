import { NextFunction, Request, Response } from 'express'
import path from 'path'

import BlogPost from '../models/BlogPost'
import { createOne, deleteOne, getAll, getOne } from './handler-factory'
import { AppError } from '../lib/app-error'
import catchAsync from '../lib/catch-async'
import { UploadService } from '../services/upload'
import { generateUniqueFileName } from '../lib/util'
import * as redis from '../services/redis'

export const getBlogPosts = getAll(BlogPost)
export const getBlogPost = getOne(BlogPost)
export const createBlogPost = createOne(BlogPost)
export const updateBlogPost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const post = await BlogPost.findById(req.params.id)

        if (!post)
            return next(
                new AppError(
                    req.t('errors.not-found', {
                        field: req.t('words.post'),
                    }),
                    404
                )
            )

        const body = req.body

        Object.keys(body).forEach((key) => {
            // @ts-ignore
            post[key] = body[key]
        })

        // Trigger pre-save middleware
        await post.save()

        await redis.deleteCachedValueByKey(
            `${BlogPost.modelName.toLowerCase()}:${String(post._id)}`
        )

        res.status(200).json({
            data: post,
        })
        return
    }
)
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
