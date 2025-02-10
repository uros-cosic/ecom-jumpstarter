import { cache } from 'react'
import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'
import { IOrder } from '../types'

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
