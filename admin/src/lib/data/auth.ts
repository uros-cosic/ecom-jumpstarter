'use server'

import { cookies } from 'next/headers'
import { loginFormSchemaValues } from '../forms/login'
import { getOptions } from './factory'
import { API_AUTH_URL } from '../constants'
import { IUser, USER_ROLE } from '../types'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { passwordChangeSchemaValues } from '../forms/password-change'

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
        const res = await fetch(`${API_AUTH_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            if (data.data.role !== USER_ROLE.ADMIN)
                throw new Error('Invalid email or password')

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
        redirect('/login')
    }
}

/**
 * Updates current users password
 * Returns tuple representing [data, error]
 */
export const changePassword = async (
    values: passwordChangeSchemaValues
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
