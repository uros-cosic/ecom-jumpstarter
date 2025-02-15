'use server'

import { cache } from 'react'
import { IProduct, RequestQuery } from '../types'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'
import { toQueryString } from '../utils'

export const getProducts = cache(async function (
    query: RequestQuery<IProduct>
): Promise<IProduct[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/products?${q}`,
            await getOptions(['products'])
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
