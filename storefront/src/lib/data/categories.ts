'use server'

import { cache } from 'react'

import { IProductCategory, RequestQuery } from '@/lib/types'
import { toQueryString } from '../utils'
import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'

export const getCategories = cache(async function (
    query: RequestQuery<IProductCategory> = {}
): Promise<IProductCategory[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_STORE_URL}/productCategories?${q}`,
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

export const getCategoryByHandle = cache(async function (
    handle: string
): Promise<IProductCategory | null> {
    const data = await getCategories({ handle, limit: 1 })

    if (!data || !data.length) return null

    return data[0]
})

export const getCategoryById = cache(async function (
    id: string
): Promise<IProductCategory | null> {
    try {
        const res = await fetch(
            `${API_STORE_URL}/productCategories/${id}`,
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
