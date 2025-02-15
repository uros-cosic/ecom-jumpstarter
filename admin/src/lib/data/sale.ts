'use server'

import { cache } from 'react'
import { ISale, RequestQuery } from '../types'
import { API_ADMIN_URL } from '../constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'

export const getSales = cache(async function (
    query: RequestQuery<ISale> = {}
): Promise<ISale[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/sales?${q}`,
            await getOptions(['sales'])
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
