'use server'

import { cache } from 'react'
import { API_ADMIN_URL } from '../constants'
import { IUser, RequestQuery } from '../types'
import { getOptions } from './factory'
import { toQueryString } from '../utils'
import { userSchemaValues } from '../forms/user'
import { revalidateTag } from 'next/cache'
import { accountSchemaValues } from '../forms/account'

export const getMe = async (): Promise<IUser | null> => {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/users/me`,
            await getOptions(['user'])
        )

        const data = await res.json()

        if (res.ok) return data.data

        console.error(data.message)

        return null
    } catch (e) {
        console.error(e)
        return null
    }
}

export const getUsers = cache(async function (
    query: RequestQuery<IUser> = {}
): Promise<IUser[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/users?${q}`,
            await getOptions(['users'])
        )

        const data = await res.json()

        if (res.ok) return data.data

        console.error(data.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
})

export const getUserById = cache(async function (
    id: IUser['_id']
): Promise<IUser | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/users/${id}`,
            await getOptions([`user-${id}`])
        )

        const data = await res.json()

        if (res.ok) return data.data

        console.error(data.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
})

/**
 * Updates user
 * Retruns tuple representing [data, err]
 */
export const updateUser = async (
    id: IUser['_id'],
    values: userSchemaValues
): Promise<[IUser | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/users/${id}`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('users')
            revalidateTag(`user-${id}`)
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Deletes user
 * Retruns tuple representing [data, err]
 */
export const deleteUser = async (
    id: IUser['_id']
): Promise<[boolean | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/users/${id}`, {
            method: 'DELETE',
            headers: options.headers,
        })

        if (res.ok) {
            revalidateTag('users')
            revalidateTag(`user-${id}`)
            return [true, null]
        }

        const data = await res.json()

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Updates current user
 * Returns tuple representing [data, error]
 */
export const updateMe = async (
    values: accountSchemaValues
): Promise<[IUser | null, string | null]> => {
    try {
        const options = await getOptions()

        const res = await fetch(`${API_ADMIN_URL}/users/updateMe`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('user')
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
