'use server'

import { cache } from 'react'
import { IDiscount, RequestQuery } from '../types'
import { toQueryString } from '../utils'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'

export const getDiscounts = cache(async function (
    query: RequestQuery<IDiscount> = {}
): Promise<IDiscount[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/discounts?${q}`,
            await getOptions(['discounts'])
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
