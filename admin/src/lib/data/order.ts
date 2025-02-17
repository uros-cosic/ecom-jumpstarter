'use server'

import { cache } from 'react'

import { API_ADMIN_URL } from '../constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'
import { IOrder, RequestQuery } from '../types'
import { revalidateTag } from 'next/cache'

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

export const getOrderById = cache(async function (
    id: IOrder['_id']
): Promise<IOrder | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/orders/${id}`,
            await getOptions([`order-${id}`])
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
 * Updates the order
 * Returns a tuple representing [data, error]
 */
export const updateOrder = async function (
    values: Partial<IOrder>,
    id: IOrder['_id']
): Promise<[IOrder | null, string | null]> {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/orders/${id}`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('orders')
            revalidateTag(`order-${id}`)

            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
