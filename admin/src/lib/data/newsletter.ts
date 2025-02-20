'use server'

import { cache } from 'react'
import { INewsletter, RequestQuery } from '../types'
import { toQueryString } from '../utils'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'

export const getNewsletters = cache(async function (
    query: RequestQuery<INewsletter> = {}
): Promise<INewsletter[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/newsletters?${q}`,
            await getOptions(['newsletters'])
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
 * Gets download url
 * Returns tuple representing [data, err]
 */
export const handleDownload = async (
    format: 'txt' | 'csv'
): Promise<[string | null, string | null]> => {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/newsletters/download?format=${format}`,
            await getOptions()
        )

        const data = await res.json()

        if (res.ok) return [data.data, null]

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
