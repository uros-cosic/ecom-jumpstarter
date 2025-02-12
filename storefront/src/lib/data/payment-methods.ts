'use server'

import { cache } from 'react'
import { IPaymentMethod, RequestQuery } from '../types'
import { toQueryString } from '../utils'
import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'

export const getPaymentMethods = cache(async function (
    query: RequestQuery<IPaymentMethod> = {}
): Promise<IPaymentMethod[] | null> {
    try {
        const q = toQueryString(query)

        const res = await fetch(
            `${API_STORE_URL}/paymentMethods?${q}`,
            await getOptions(['payment-methods'])
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

export const getPaymentMethodById = cache(async function (
    id: string
): Promise<IPaymentMethod | null> {
    try {
        const res = await fetch(
            `${API_STORE_URL}/paymentMethods/${id}`,
            await getOptions([`payment-method-${id}`])
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
