'use server'

import { cache } from 'react'
import { toQueryString } from '../utils'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'
import { IProductCollection, RequestQuery } from '../types'

export const getCollections = cache(async function (
    query: RequestQuery<IProductCollection> = {}
): Promise<IProductCollection[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/productCollections?${q}`,
            await getOptions(['collections'])
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
