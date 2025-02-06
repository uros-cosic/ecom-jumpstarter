import { cache } from 'react'

import { IProductCollection, RequestQuery } from '@/lib/types'
import { toQueryString } from '../utils'
import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'

export const getCollections = cache(async function (
    query: RequestQuery<IProductCollection> = {}
): Promise<IProductCollection[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_STORE_URL}/productCollections?${q}`,
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
