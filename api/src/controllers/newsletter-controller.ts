import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { Parser } from 'json2csv'
import fs from 'fs'
import fsp from 'fs/promises'

import catchAsync from '../lib/catch-async'
import Newsletter from '../models/Newsletter'
import { getAll, getOne, updateOne } from './handler-factory'
import { AppError } from '../lib/app-error'
import { filterObj } from '../lib/util'

export const getNewsletters = getAll(Newsletter)
export const getNewsletter = getOne(Newsletter)
export const createNewsletter = catchAsync(
    async (req: Request, res: Response) => {
        const body = filterObj(req.body, 'email')

        const doc = await Newsletter.create(body)

        return res.status(201).json({ data: doc })
    }
)
export const updateNewsletter = updateOne(Newsletter)
export const deleteNewsletter = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body

        if (!email) return next(new AppError(req.t('errors.bad-request'), 400))

        const newsletter = await Newsletter.findOneAndUpdate(
            { email },
            {
                active: false,
                canceledAt: new Date(),
            }
        )

        if (!newsletter)
            return next(new AppError(req.t('errors.bad-request'), 400))

        res.status(204).json({
            data: null,
        })
        return
    }
)

export const downloadMailList = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const format = (req.query.format as string) || 'txt'

        if (!['txt', 'csv'].includes(format))
            return next(new AppError(req.t('errors.bad-request'), 400))

        const newsletters = await Newsletter.find({ active: { $ne: false } })

        if (!newsletters.length)
            return next(
                new AppError(
                    req.t('errors.not-found', {
                        field: req.t('words.newsletter-list'),
                    }),
                    404
                )
            )

        const emailList = newsletters.map((nl) => nl.email)

        const formattedEmails = emailList.join(',')

        const fileName = `newsletter_emails_${Date.now()}.${format}`
        const destination = path.join(process.cwd(), 'public', 'newsletter')
        const filePath = path.join(destination, fileName)

        await fsp.mkdir(destination, { recursive: true })

        if (format === 'csv') {
            const fields = ['email']
            const json2csvParser = new Parser({ fields })
            const csvData = json2csvParser.parse(newsletters)

            fs.writeFile(filePath, csvData, (err) => {
                if (err) return next(new AppError(err.message))
            })
        }

        fs.writeFile(filePath, formattedEmails, (err) => {
            if (err) return next(new AppError(err.message))
        })

        res.status(200).json({
            data: `${req.protocol}://${req.get('host')}/newsletter/${fileName}`,
        })
        return
    }
)
