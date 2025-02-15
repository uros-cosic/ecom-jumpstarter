'use server'

import { cache } from 'react'

import { API_ADMIN_URL } from '../constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'
import { IOrder, RequestQuery } from '../types'

export const getOrders = cache(async function (
    query: RequestQuery<IOrder>
): Promise<IOrder[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/orders?${q}`,
            await getOptions(['orders'])
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
