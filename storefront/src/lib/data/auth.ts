'use server'

import { revalidateTag } from 'next/cache'
import { API_AUTH_URL } from '../constants'
import { loginFormSchemaValues } from '../forms/log-in'
import { getOptions } from './factory'
import { cookies } from 'next/headers'
import { IUser } from '../types'
import { registerFormSchemaValues } from '../forms/register'
import { passwordChangeFormSchemaValues } from '../forms/account'
import { getCart, updateCart } from './cart'

export const setAuthToken = async (name: string, token: string) => {
    ;(await cookies()).set(name, token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })
}

export const removeAuthToken = async (name: string) => {
    ;(await cookies()).set(name, '', {
        maxAge: -1,
    })
}

/**
 *  Log ins the user
 *  Returns tuple indicating [data, error]
 */
export const logIn = async (
    values: loginFormSchemaValues
): Promise<[IUser | null, string | null]> => {
    try {
        const options = await getOptions()

        const res = await fetch(`${API_AUTH_URL}/login`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            await setAuthToken('jwt', data.token)
            await setAuthToken('refreshToken', data.refreshToken)

            revalidateTag('user')
            const cart = await getCart()

            if (cart) {
                await updateCart({ customer: data.data._id })
                revalidateTag(`cart-${cart._id}`)
            }

            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 *  Registers the user
 *  Returns tuple indicating [data, error]
 */
export const register = async (
    values: registerFormSchemaValues
): Promise<[IUser | null, string | null]> => {
    try {
        const options = await getOptions()

        const res = await fetch(`${API_AUTH_URL}/register`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            await setAuthToken('jwt', data.token)
            await setAuthToken('refreshToken', data.refreshToken)

            revalidateTag('user')
            const cart = await getCart()

            if (cart) {
                await updateCart({ customer: data.data._id })
                revalidateTag(`cart-${cart._id}`)
            }

            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

export const logOut = async () => {
    try {
        const options = await getOptions()
        await fetch(`${API_AUTH_URL}/logout`, { method: 'POST', ...options })
    } catch (e) {
        console.error(e)
    } finally {
        await removeAuthToken('jwt')
        await removeAuthToken('refreshToken')
        revalidateTag('user')
        const cart = await getCart()

        if (cart) {
            await updateCart({ customer: null })
            revalidateTag(`cart-${cart._id}`)
        }
    }
}

/**
 * Updates current users password
 * Returns tuple representing [data, error]
 */
export const changePassword = async (
    values: passwordChangeFormSchemaValues
): Promise<[IUser | null, string | null]> => {
    try {
        const options = await getOptions()

        const res = await fetch(`${API_AUTH_URL}/changePassword`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            await setAuthToken('jwt', data.token)
            await setAuthToken('refreshToken', data.refreshToken)

            revalidateTag('user')

            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
