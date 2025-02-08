'use server'

import { API_STORE_URL } from '@/lib/constants'
import { getOptions } from './factory'

export const getMe = async () => {
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
