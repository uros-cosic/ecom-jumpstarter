'use server'

import { cache } from 'react'
import { ISale, RequestQuery } from '../types'
import { API_ADMIN_URL } from '../constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'
import { saleSchemaValues } from '../forms/sale'
import { revalidateTag } from 'next/cache'

export const getSales = cache(async function (
    query: RequestQuery<ISale> = {}
): Promise<ISale[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/sales?${q}`,
            await getOptions(['sales'])
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

export const getSaleById = cache(async function (
    id: ISale['_id']
): Promise<ISale | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/sales/${id}`,
            await getOptions([`sale-${id}`])
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
 * Creates sale
 * Returns tuple representing [data, error]
 */
export const createSale = async (
    values: saleSchemaValues
): Promise<[ISale | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/sales`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('sales')
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Updates sale
 * Returns tuple representing [data, error]
 */
export const updateSale = async (
    id: ISale['_id'],
    values: saleSchemaValues
): Promise<[ISale | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/sales/${id}`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('sales')
            revalidateTag(`sale-${id}`)
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Deletes sale
 * Retruns tuple representing [data, err]
 */
export const deleteSale = async (
    id: ISale['_id']
): Promise<[boolean | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/sales/${id}`, {
            method: 'DELETE',
            headers: options.headers,
        })

        if (res.ok) {
            revalidateTag('sales')
            revalidateTag(`sale-${id}`)
            return [true, null]
        }

        const data = await res.json()

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Gets uploaded thumbnail URL
 * Returns tuple representing [data, null]
 */
export const uploadThumbnail = async (
    formData: FormData
): Promise<[string | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/uploads/sales/thumbnail`, {
            method: 'POST',
            headers: options.headers,
            body: formData,
        })

        const data = await res.json()

        if (res.ok) return [data.data, null]

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
