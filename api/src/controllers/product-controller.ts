import { NextFunction, Request, Response } from 'express'
import path from 'path'

import catchAsync from '../lib/catch-async'
import Product from '../models/Product'
import {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne,
} from './handler-factory'
import { AppError } from '../lib/app-error'
import { UploadService } from '../services/upload'
import { generateUniqueFileName } from '../lib/util'
import Sale from '../models/Sale'
import { APIFeatures } from '../lib/api-features'

export const getProducts = getAll(Product)
export const getProduct = getOne(Product)
export const createProduct = createOne(Product)
export const updateProduct = updateOne(Product)
export const deleteProduct = deleteOne(Product)

export const searchProducts = catchAsync(
    async (req: Request, res: Response) => {
        const { q } = req.query

        if (!q) {
            res.status(200).json({ data: [] })
            return
        }

        const limit = Number(req.query.limit || 5)

        const products = await Product.find({
            name: {
                $regex: q,
                $options: 'i',
            },
        }).limit(limit)

        res.status(200).json({ data: products })
        return
    }
)

export const getProductsOnSale = catchAsync(
    async (req: Request, res: Response) => {
        const sales = await Sale.find({})

        const uniqueProducts = Array.from(
            new Set(
                sales
                    .filter((sale) => sale.isActive())
                    .map((sale) => sale.products)
                    .flat()
            )
        )
        const features = new APIFeatures(
            Product.find({ _id: { $in: uniqueProducts } }),
            req.query
        )
            .sort()
            .limitFields()
            .paginate()

        const doc = await features.query

        res.status(200).json({ status: 'success', data: doc })
        return
    }
)

export const uploadProductThumbnail = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) return next(new AppError(req.t('errors.no-file'), 400))

        const filePath = await UploadService.uploadImage(
            req.file.buffer,
            path.join('public', 'images', 'product'),
            generateUniqueFileName(req.file),
            { quality: 100 }
        )

        res.status(201).json({ data: filePath })
        return
    }
)

export const uploadProductImages = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const files = req.files as Express.Multer.File[]

        if (!files || !files.length)
            return next(new AppError(req.t('errors.no-file'), 400))

        const images = []

        for (const file of files) {
            const filePath = await UploadService.uploadImage(
                file.buffer,
                path.join('public', 'images', 'product'),
                generateUniqueFileName(file),
                { quality: 100 }
            )

            images.push(filePath)
        }

        res.status(201).json({ data: res })
        return
    }
)
