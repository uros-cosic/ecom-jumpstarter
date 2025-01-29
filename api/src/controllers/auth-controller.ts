import { CookieOptions, NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { promisify } from 'util'

import User, { IUser } from '../models/User'
import catchAsync from '../lib/catch-async'
import { AppError } from '../lib/app-error'
import RefreshToken from '../models/RefreshToken'

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
    res: Response
) => {
    const token = signToken(String(user._id))

    const refreshToken = await RefreshToken.create({
        user: user._id,
        token: crypto.randomBytes(32).toString('hex'),
    })

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
    res.cookie('refreshToken', refreshToken.token, {
        ...cookieOptions,
        expires: refreshToken.expiresAt,
    })

    const freshUser = user.toObject()

    res.status(statusCode).json({
        token,
        refreshToken: refreshToken.token,
        data: freshUser,
    })
    return
}

export const logIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password }: { email?: string; password?: string } =
            req.body

        if (!email || !password)
            return next(
                new AppError(
                    req.t('errors.invalid', {
                        field: req.t('words.email-or-password'),
                    }),
                    400
                )
            )

        const user = await User.findOne({ email }).select('+password')

        if (!user || !(await user.correctPassword(password, user.password)))
            return next(
                new AppError(
                    req.t('error.invalid', {
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
        const {
            name,
            email,
            password,
            region,
        }: { name: string; email: string; password: string; region: string } =
            req.body

        if (!name || !email || !password || !region) {
            return next(new AppError(req.t('errors.fill-in-fields'), 400))
        }

        const newUser = await User.create({ name, email, password, region })

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

        try {
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
        } catch (e: any) {
            if (e.name !== 'TokenExpiredError' || !req.cookies.refreshToken)
                throw e

            const refreshToken = await RefreshToken.findOne({
                token: req.cookies.refreshToken,
            })

            if (
                !refreshToken ||
                refreshToken.revokedAt ||
                new Date() > new Date(refreshToken.expiresAt)
            ) {
                removeCookie('jwt', res)
                removeCookie('refreshToken', res)
                throw e
            }

            const newToken = signToken(String(refreshToken.user))

            const cookieOptions: CookieOptions = {
                expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
                httpOnly: true,
                sameSite: 'lax',
            }

            if (process.env.NODE_ENV === 'production') {
                cookieOptions.secure = true
                cookieOptions.sameSite = 'none'
            }

            res.cookie('jwt', newToken, cookieOptions)

            const freshUser = await User.findById(refreshToken.user)

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

            res.locals.user = freshUser

            next()
        }
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

    res.status(200).json({
        data: null,
    })
    return
}

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

        createSendToken(user, 200, res)
        return
    }
)
