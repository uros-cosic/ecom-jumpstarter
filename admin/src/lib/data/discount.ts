'use server'

import { cache } from 'react'
import { IDiscount, RequestQuery } from '../types'
import { toQueryString } from '../utils'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'
import { discountSchemaValues } from '../forms/discount'
import { revalidateTag } from 'next/cache'

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

export const getDiscountById = cache(async function (
    id: IDiscount['_id']
): Promise<IDiscount | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/discounts/${id}`,
            await getOptions([`discount-${id}`])
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
 * Creates discount
 * Returns tuple representing [data, error]
 */
export const createDiscount = async (
    values: discountSchemaValues
): Promise<[IDiscount | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/discounts`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('discounts')
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Updates discount
 * Returns tuple representing [data, error]
 */
export const updateDiscount = async (
    id: IDiscount['_id'],
    values: discountSchemaValues
): Promise<[IDiscount | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/discounts/${id}`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('discounts')
            revalidateTag(`discount-${id}`)
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Deletes discount
 * Retruns tuple representing [data, err]
 */
export const deleteDiscount = async (
    id: IDiscount['_id']
): Promise<[boolean | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/discounts/${id}`, {
            method: 'DELETE',
            headers: options.headers,
        })

        if (res.ok) {
            revalidateTag('discounts')
            revalidateTag(`discount-${id}`)
            return [true, null]
        }

        const data = await res.json()

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
