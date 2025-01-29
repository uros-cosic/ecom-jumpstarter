import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import i18next from 'i18next'

import { AppError } from '../lib/app-error'

const sendErrorDev = (err: any, _req: Request, res: Response) => {
    console.error('ERROR: ', err)

    return res.status(err.statusCode).json({
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

const sendErrorProduction = (err: any, req: Request, res: Response) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message,
        })
    }

    console.error('ERROR:', err)

    return res.status(err.statusCode || 500).json({
        message: req.t('errors.default'),
    })
}

const handleCastErrorDB = (err: any, lng: string) => {
    const message = `${i18next.t('words.invalid', { lng })} ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err: any, lng: string) => {
    const value = err?.errorResponse?.errmsg?.match(/(["'])(\\?.)*?\1/)[0]
    const message = `${i18next.t('words.duplicate', { lng })}: ${value}.`

    return new AppError(message, 400)
}

const handleValidationErrorDB = (err: any, lng: string) => {
    const errors = Object.values(err.errors).map((el: any) => el.message)

    const message = `${i18next.t('words.invalid-input-data', {
        lng,
    })}. ${errors.join('. ')}`

    return new AppError(message, 400)
}

const handleJWTError = (lng: string) =>
    new AppError(i18next.t('errors.incorrect-token', { lng }), 401)

const handleJWTExpiredError = (lng: string) =>
    new AppError(i18next.t('errors.token-expired', { lng }), 401)

export = (err: any, req: Request, res: Response, _next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)
    } else {
        let error = { ...err }
        error.message = err.message

        if (err instanceof mongoose.Error.CastError)
            error = handleCastErrorDB(error, req.language)
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error, req.language)
        if (err instanceof mongoose.Error.ValidationError)
            error = handleValidationErrorDB(error, req.language)
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError(req.language)
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError(req.language)

        sendErrorProduction(error, req, res)
    }
}
