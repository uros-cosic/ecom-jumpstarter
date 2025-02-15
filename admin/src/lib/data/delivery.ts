'use server'

import { cache } from 'react'
import { IShippingMethod, RequestQuery } from '../types'
import { API_ADMIN_URL } from '../constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'

export const getShippingMethods = cache(async function (
    query: RequestQuery<IShippingMethod>
): Promise<IShippingMethod[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/shippingMethods?${q}`,
            await getOptions(['shipping-methods'])
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
