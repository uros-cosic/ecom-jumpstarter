'use server'

import { cache } from 'react'
import { toQueryString } from '../utils'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'
import { IProductCollection, RequestQuery } from '../types'
import { collectionSchemaValues } from '../forms/collection'
import { revalidateTag } from 'next/cache'

export const getCollections = cache(async function (
    query: RequestQuery<IProductCollection> = {}
): Promise<IProductCollection[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/productCollections?${q}`,
            await getOptions(['collections'])
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

export const getCollectionById = cache(async function (
    id: string
): Promise<IProductCollection | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/productCollections/${id}`,
            await getOptions([`collection-${id}`])
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
 * Creates collection
 * Retruns tuple representing [data, err]
 */
export const createCollection = async (
    values: collectionSchemaValues
): Promise<[IProductCollection | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/productCollections`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('collections')
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Updates collection
 * Retruns tuple representing [data, err]
 */
export const updateCollection = async (
    id: IProductCollection['_id'],
    values: collectionSchemaValues
): Promise<[IProductCollection | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/productCollections/${id}`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('collections')
            revalidateTag(`collection-${id}`)
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Deletes collection
 * Retruns tuple representing [data, err]
 */
export const deleteCollection = async (
    id: IProductCollection['_id']
): Promise<[boolean | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/productCollections/${id}`, {
            method: 'DELETE',
            headers: options.headers,
        })

        if (res.ok) {
            revalidateTag('collections')
            revalidateTag(`collection-${id}`)
            return [true, null]
        }

        const data = await res.json()

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
