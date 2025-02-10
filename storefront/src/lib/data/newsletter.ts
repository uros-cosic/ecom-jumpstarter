'use server'

import { INewsletter } from '@/lib/types'
import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'

/**
 * Subscribes the user to the newsletter
 * Returns tuple indicating [data, error]
 */
export const subscribeToNewsletter = async (
    email: string,
    region: string
): Promise<[INewsletter | null, string | null]> => {
    try {
        const options = await getOptions()

        const res = await fetch(`${API_STORE_URL}/newsletters`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, region }),
        })

        const data = await res.json()

        if (res.ok) return [data.data, null]

        console.error(data.message)
        return [null, data.message]
    } catch (e) {
        console.error(e)
        return [null, String(e)]
    }
}
