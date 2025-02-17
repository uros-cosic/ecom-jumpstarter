'use server'

import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'

/**
 * Gets uploaded image
 * Retruns tuple representing [data, err]
 */
export const uploadImage = async (
    formData: FormData
): Promise<[string | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/uploads/image`, {
            method: 'POST',
            headers: options.headers,
            body: formData,
        })

        const data = await res.json()

        if (res.ok) return [data.data, null]

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
