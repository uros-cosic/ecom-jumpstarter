import { CookieOptions, NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { promisify } from 'util'

import User, { IUser } from '../models/User'
import catchAsync from '../lib/catch-async'
import { AppError } from '../lib/app-error'
import RefreshToken from '../models/RefreshToken'
import * as redis from '../services/redis'
import eventBus from '../services/event-bus'
import { UserService } from '../services/user'

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES,
    })
}

const removeCookie = (name: string, res: Response) => {
    const cookieOptions: CookieOptions = {
        maxAge: -1,
        httpOnly: true,
        sameSite: 'lax',
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true
        cookieOptions.sameSite = 'none'
    }

    res.cookie(name, '', cookieOptions)
}

export const createSendToken = async (
    user: IUser,
    statusCode: number,
    res: Response,
    createRefreshToken: boolean = true
) => {
    const token = signToken(String(user._id))

    const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'lax',
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true
        cookieOptions.sameSite = 'none'
    }

    res.cookie('jwt', token, cookieOptions)

    let refreshToken

    if (createRefreshToken) {
        refreshToken = await RefreshToken.create({
            user: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        })

        res.cookie('refreshToken', refreshToken.token, {
            ...cookieOptions,
            expires: refreshToken.expiresAt,
        })
    }

    const freshUser = user.toObject()

    const data: { token: string; data: IUser; refreshToken?: string } = {
        token,
        data: freshUser,
    }

    if (createRefreshToken && refreshToken)
        data.refreshToken = refreshToken.token

    res.status(statusCode).json(data)
    return
}

export const logIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            email,
            password,
            googleId,
        }: { email?: string; password?: string; googleId?: string } = req.body

        if (!email)
            return next(
                new AppError(
                    req.t('errors.invalid', {
                        field: req.t('words.email-or-password'),
                    }),
                    400
                )
            )

        if (!password && !googleId)
            return next(new AppError(req.t('errors.bad-request'), 400))

        const user = await User.findOne({ email }).select('+password')

        if (!user)
            return next(
                new AppError(
                    req.t('errors.invalid', {
                        field: req.t('words.email-or-password'),
                    }),
                    401
                )
            )

        if (googleId && user.googleId !== googleId)
            return next(
                new AppError(
                    req.t('errors.invalid', {
                        field: req.t('errors.bad-request'),
                    }),
                    400
                )
            )

        if (password && !(await user.correctPassword(password, user.password)))
            return next(
                new AppError(
                    req.t('errors.invalid', {
                        field: req.t('words.email-or-password'),
                    }),
                    401
                )
            )

        await createSendToken(user, 200, res)
        return
    }
)

export const register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        let {
            name,
            email,
            password,
            region,
            googleId,
        }: {
            name: string
            email: string
            password?: string
            region: string
            googleId?: string
        } = req.body

        if (!name || !email || !region) {
            return next(new AppError(req.t('errors.fill-in-fields'), 400))
        }

        if (!googleId && !password) {
            return next(new AppError(req.t('errors.fill-in-fields'), 400))
        }

        if (!password) {
            password = Math.random().toString(36).slice(-12)
        }

        const newUser = await User.create({
            name,
            email,
            password,
            region,
            googleId,
        })

        await createSendToken(newUser, 201, res)
        return
    }
)

export const protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        let token

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt
        }

        if (!token) {
            return next(new AppError(req.t('errors.log-in'), 401))
        }

        const decoded = (await promisify(jwt.verify)(
            token,
            // @ts-ignore
            process.env.JWT_SECRET!
        )) as unknown as { id: string; iat: number }

        const freshUser = await User.findById(decoded?.id)

        if (!freshUser) {
            return next(
                new AppError(
                    req.t('errors.not-found', {
                        field: req.t('words.user'),
                    }),
                    401
                )
            )
        }

        if (freshUser.changedPasswordAfter(decoded.iat)) {
            return next(
                new AppError(req.t('errors.recently-changed-password'), 401)
            )
        }

        res.locals.user = freshUser
        next()
    }
)

export const restrictTo = (...roles: Array<string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals.user || !roles.includes(res.locals.user.role)) {
            return next(new AppError(req.t('errors.access-denied'), 403))
        }
        next()
    }
}

export const logOut = (_req: Request, res: Response) => {
    removeCookie('jwt', res)
    removeCookie('refreshToken', res)

    res.locals.user = null

    res.status(200).json({
        data: null,
    })
    return
}

export const generatePasswordResetToken = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body

        if (!email) return next(new AppError(req.t('errors.bad-request'), 400))

        const user = await User.findOne({ email })

        if (!user)
            return next(
                new AppError(
                    req.t('errors.not-found', { field: req.t('words.user') }),
                    404
                )
            )

        if (user.resetPasswordExpires && new Date() < user.resetPasswordExpires)
            return next(new AppError(req.t('errors.bad-request'), 400))

        const resetToken = crypto.randomBytes(32).toString('hex')

        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        user.resetPasswordToken = hashedToken
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000)

        await user.save()
        await redis.deleteCachedValueByKey(
            `${User.modelName.toLowerCase()}:${String(user._id)}`
        )

        eventBus.emit(UserService.Events.PASSWORD_RESET, {
            token: resetToken,
            user: user.toObject(),
        })

        res.status(201).json({ data: req.t('words.password-reset-sent') })
        return
    }
)

export const resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { token, email, password } = req.body

        if (!token || !email || !password)
            return next(new AppError('errors.bad-request', 400))

        const user = await User.findOne({ email })

        if (!user) return next(new AppError('errors.bad-request', 400))

        if (
            !user.resetPasswordExpires ||
            new Date(user.resetPasswordExpires) < new Date()
        ) {
            user.resetPasswordToken = null
            user.resetPasswordExpires = null
            await user.save()
            await redis.deleteCachedValueByKey(
                `${User.modelName.toLowerCase()}:${String(user._id)}`
            )

            return next(new AppError('errors.token-expired', 400))
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        if (hashedToken !== user.resetPasswordToken)
            return next(
                new AppError(req.t('errors.invalid', { field: 'Token' }), 400)
            )

        user.password = password
        user.resetPasswordToken = null
        user.resetPasswordExpires = null

        await user.save()
        await redis.deleteCachedValueByKey(
            `${User.modelName.toLowerCase()}:${String(user._id)}`
        )

        await createSendToken(user, 200, res)
        return
    }
)

export const updatePassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.passwordCurrent || !req.body.password)
            return next(
                new AppError(
                    req.t('errors.required-field', {
                        field: req.t('words.password-current'),
                    }),
                    400
                )
            )

        const user = await User.findById(res.locals.user?.id).select(
            '+password'
        )

        if (!user)
            return next(
                new AppError(
                    req.t('errors.not-found', { field: req.t('words.user') }),
                    404
                )
            )

        if (
            !(await user.correctPassword(
                req.body.passwordCurrent,
                user.password
            ))
        ) {
            return next(
                new AppError(
                    req.t('errors.incorrect-field', {
                        field: req.t('words.password'),
                    }),
                    401
                )
            )
        }

        user.password = req.body.password

        await user.save()

        await redis.deleteCachedValueByKey(
            `${User.modelName.toLowerCase()}:${String(user._id)}`
        )

        createSendToken(user, 200, res)
        return
    }
)

export const refreshToken = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        let token

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('RefreshToken')
        ) {
            token = req.headers.authorization.split(' ')[1]
        } else if (req.cookies.refreshToken) {
            token = req.cookies.refreshToken
        }

        if (!token) {
            return next(new AppError(req.t('errors.bad-request'), 400))
        }

        const refreshToken = await RefreshToken.findOne({
            token,
        })

        if (
            !refreshToken ||
            refreshToken.revokedAt ||
            new Date() > new Date(refreshToken.expiresAt)
        ) {
            removeCookie('jwt', res)
            removeCookie('refreshToken', res)
            return next(
                new AppError(req.t('errors.not-found', { field: 'Token' }), 404)
            )
        }

        const user = await User.findById(refreshToken.user)

        if (!user) {
            return next(
                new AppError(
                    req.t('errors.not-found', {
                        field: req.t('words.user'),
                    }),
                    401
                )
            )
        }

        createSendToken(user, 200, res, false)
        return
    }
)
