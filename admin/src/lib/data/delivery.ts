'use server'

import { cache } from 'react'
import { IShippingMethod, RequestQuery } from '../types'
import { API_ADMIN_URL } from '../constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'
import { shippingMethodSchema } from '../forms/delivery'
import { revalidateTag } from 'next/cache'

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

export const getShippingMethodById = cache(async function (
    id: IShippingMethod['_id']
): Promise<IShippingMethod | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/shippingMethods/${id}`,
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

/**
 * Creates shipping method
 * Returns tuple representing [data, error]
 */
export const createShippingMethod = async (
    values: shippingMethodSchema
): Promise<[IShippingMethod | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/shippingMethods`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('shipping-methods')
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Updates shipping method
 * Returns tuple representing [data, error]
 */
export const updateShippingMethod = async (
    id: IShippingMethod['_id'],
    values: shippingMethodSchema
): Promise<[IShippingMethod | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/shippingMethods/${id}`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('shipping-methods')
            revalidateTag(`shipping-methods-${id}`)
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Deletes shipping method
 * Retruns tuple representing [data, err]
 */
export const deleteShippingMethod = async (
    id: IShippingMethod['_id']
): Promise<[boolean | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/shippingMethods/${id}`, {
            method: 'DELETE',
            headers: options.headers,
        })

        if (res.ok) {
            revalidateTag('shipping-methods')
            revalidateTag(`shipping-method-${id}`)
            return [true, null]
        }

        const data = await res.json()

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
