'use server'

import { cache } from 'react'
import { IProductCategory, RequestQuery } from '../types'
import { toQueryString } from '../utils'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'
import { revalidateTag } from 'next/cache'
import { categorySchemaValues } from '../forms/category'

export const getCategories = cache(async function (
    query: RequestQuery<IProductCategory> = {}
): Promise<IProductCategory[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/productCategories?${q}`,
            await getOptions(['categories'])
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

export const getCategoryById = cache(async function (
    id: string
): Promise<IProductCategory | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/productCategories/${id}`,
            await getOptions([`category-${id}`])
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
 * Creates category
 * Retruns tuple representing [data, err]
 */
export const createCategory = async (
    values: categorySchemaValues
): Promise<[IProductCategory | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/productCategories`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('categories')
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Updates category
 * Retruns tuple representing [data, err]
 */
export const updateCategory = async (
    id: IProductCategory['_id'],
    values: categorySchemaValues
): Promise<[IProductCategory | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/productCategories/${id}`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('categories')
            revalidateTag(`category-${id}`)
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Deletes category
 * Retruns tuple representing [data, err]
 */
export const deleteCategory = async (
    id: IProductCategory['_id']
): Promise<[boolean | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/productCategories/${id}`, {
            method: 'DELETE',
            headers: options.headers,
        })

        if (res.ok) {
            revalidateTag('categories')
            revalidateTag(`category-${id}`)
            return [true, null]
        }

        const data = await res.json()

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
