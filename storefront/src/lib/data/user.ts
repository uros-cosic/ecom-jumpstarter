'use server'

import { revalidateTag } from 'next/cache'

import { API_STORE_URL } from '@/lib/constants'
import { getOptions } from './factory'
import { IUser } from '../types'

export const getMe = async (): Promise<IUser | null> => {
    try {
        const res = await fetch(
            `${API_STORE_URL}/users/me`,
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

/**
 * Updates current user
 * Returns tuple representing [data, error]
 */
export const updateMe = async (
    values: Partial<IUser>
): Promise<[IUser | null, string | null]> => {
    try {
        const options = await getOptions()

        const res = await fetch(`${API_STORE_URL}/users/updateMe`, {
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
