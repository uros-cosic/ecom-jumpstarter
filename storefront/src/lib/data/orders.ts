'use server'

import { cache } from 'react'
import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'
import { IOrder } from '../types'
import { checkoutReviewFormSchemaValues } from '../forms/checkout-review'

export const getLatestOrders = cache(async function (): Promise<
    IOrder[] | null
> {
    try {
        const res = await fetch(
            `${API_STORE_URL}/orders/latest`,
            await getOptions(['orders-latest'])
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

export const getOrderById = async function (
    id: string
): Promise<IOrder | null> {
    try {
        const res = await fetch(
            `${API_STORE_URL}/orders/${id}`,
            await getOptions()
        )

        const data = await res.json()

        if (res.ok) return data.data

        console.error(data.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
}

/**
 * Creates the order
 * Returns tuple representing [data, err]
 */
export const createOrder = async (
    values: checkoutReviewFormSchemaValues
): Promise<[IOrder | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_STORE_URL}/orders`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) return [data.data, null]

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
