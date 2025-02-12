'use server'

import { cache } from 'react'

import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'
import { IShippingMethod, RequestQuery } from '../types'
import { toQueryString } from '../utils'

export const getShippingMethods = cache(async function (
    query: RequestQuery<IShippingMethod> = {}
): Promise<IShippingMethod[] | null> {
    try {
        const q = toQueryString(query)

        const res = await fetch(
            `${API_STORE_URL}/shippingMethods?${q}`,
            await getOptions(['regions'])
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

export const getShippingMethodById = cache(async function (
    id: string
): Promise<IShippingMethod | null> {
    try {
        const res = await fetch(
            `${API_STORE_URL}/shippingMethods/${id}`,
            await getOptions([`shipping-method-${id}`])
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
