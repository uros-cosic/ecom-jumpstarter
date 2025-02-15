'use server'

import { cache } from 'react'
import { IProductCategory, RequestQuery } from '../types'
import { toQueryString } from '../utils'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'

export const getCategories = cache(async function (
    query: RequestQuery<IProductCategory> = {}
): Promise<IProductCategory[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/productCategories?${q}`,
            await getOptions(['categories'])
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
