import { NextFunction, Request, Response } from 'express'
import path from 'path'

import catchAsync from '../lib/catch-async'
import Product from '../models/Product'
import { getAll, getOne, createOne, deleteOne } from './handler-factory'
import { AppError } from '../lib/app-error'
import { UploadService } from '../services/upload'
import { generateUniqueFileName } from '../lib/util'
import Sale, { SALE_TYPE } from '../models/Sale'
import { APIFeatures } from '../lib/api-features'
import * as redis from '../services/redis'

export const getProducts = getAll(Product)
export const getProduct = getOne(Product)
export const createProduct = createOne(Product)
export const updateProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const product = await Product.findById(req.params.id)

        if (!product)
            return next(
                new AppError(
                    req.t('errors.not-found', {
                        field: req.t('words.product'),
                    }),
                    404
                )
            )

        const body = req.body

        Object.keys(body).forEach((key) => {
            // @ts-ignore
            product[key] = body[key]
        })

        // Trigger pre-save middleware
        await product.save()

        await redis.deleteCachedValueByKey(
            `${Product.modelName.toLowerCase()}:${String(product._id)}`
        )

        res.status(200).json({
            data: product,
        })
        return
    }
)
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

export const getProductPrice = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const product = await Product.findById(req.params.id)

        if (!product)
            return next(
                new AppError(
                    req.t('errors.not-found', {
                        field: req.t('words.product'),
                    }),
                    404
                )
            )

        const { variantId } = req.query

        let variant = product.variants?.find(
            (variant) => String(variant._id) === String(variantId)
        )

        let price = variant?.price ?? product.price

        // Check if there is an active sale for the product
        const sale = await Sale.findOne({
            products: String(product._id),
        }).exec()

        if (sale && sale.isActive()) {
            if (sale.type === SALE_TYPE.FIXED) price -= sale.discountAmount || 0
            if (sale.type === SALE_TYPE.PERCENTAGE)
                price -= price * (sale.discountPercentage || 0)
        }

        const data = {
            originalPrice: variant?.price ?? product.price,
            discountedPrice: Math.max(0, price),
        }

        res.status(200).json({ data })
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

        res.status(201).json({ data: images })
        return
    }
)
