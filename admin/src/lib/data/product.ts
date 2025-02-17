'use server'

import { cache } from 'react'
import { IProduct, RequestQuery } from '../types'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'
import { toQueryString } from '../utils'
import { productSchemaValues } from '../forms/product'
import { revalidateTag } from 'next/cache'

export const getProducts = cache(async function (
    query: RequestQuery<IProduct>
): Promise<IProduct[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/products?${q}`,
            await getOptions(['products'])
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

export const getProductById = cache(async function (
    id: IProduct['_id']
): Promise<IProduct | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/products/${id}`,
            await getOptions([`product-${id}`])
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
 * Creates the product
 * Retruns a tuple representing [data, err]
 */
export const createProduct = async (
    values: productSchemaValues
): Promise<[IProduct | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/products`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('products')
            return [data.data, null]
        }

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
        const res = await fetch(`${API_ADMIN_URL}/uploads/products/thumbnail`, {
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

/**
 * Gets uploaded images URLs
 * Returns tuple representing [data, null]
 */
export const uploadImages = async (
    formData: FormData
): Promise<[string[] | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/uploads/products/images`, {
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
