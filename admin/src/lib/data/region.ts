'use server'

import { cache } from 'react'
import { IRegion, RequestQuery } from '../types'
import { API_ADMIN_URL } from '../constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'
import { revalidateTag } from 'next/cache'
import { regionSchemaValues } from '../forms/region'

export const getRegions = cache(async function (
    query: RequestQuery<IRegion> = {}
): Promise<IRegion[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/regions?${q}`,
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

export const getRegionById = cache(async function (
    id: IRegion['_id']
): Promise<IRegion | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/regions/${id}`,
            await getOptions([`region-${id}`])
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
 * Creates region
 * Returns tuple representing [data, error]
 */
export const createRegion = async (
    values: regionSchemaValues
): Promise<[IRegion | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/regions`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('regions')
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Updates region
 * Returns tuple representing [data, error]
 */
export const updateRegion = async (
    id: IRegion['_id'],
    values: regionSchemaValues
): Promise<[IRegion | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/regions/${id}`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('regions')
            revalidateTag(`region-${id}`)
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Deletes region
 * Retruns tuple representing [data, err]
 */
export const deleteRegion = async (
    id: IRegion['_id']
): Promise<[boolean | null, string | null]> => {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_ADMIN_URL}/regions/${id}`, {
            method: 'DELETE',
            headers: options.headers,
        })

        if (res.ok) {
            revalidateTag('regions')
            revalidateTag(`region-${id}`)
            return [true, null]
        }

        const data = await res.json()

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
