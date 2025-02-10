'use server'

import { cache } from 'react'
import { IProduct, RequestQuery } from '../types'
import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'
import { toQueryString } from '../utils'
import { getRegionByCountryCode } from './regions'

export const getProducts = cache(async function (
    query: RequestQuery<IProduct> = {}
): Promise<IProduct[] | null> {
    try {
        const q = toQueryString(query)

        const res = await fetch(
            `${API_STORE_URL}/products?${q}`,
            await getOptions(['products'])
        )

        const data = await res.json()

        if (res.ok) {
            return data.data
        }

        console.error(data.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
})

export const getProductPrice = async (
    id: string,
    variantId?: string
): Promise<{ originalPrice: number; discountedPrice: number } | null> => {
    try {
        const res = await fetch(
            `${API_STORE_URL}/products/price/${id}?${variantId ? `variantId=${variantId}` : ''}`,
            await getOptions()
        )

        const data = await res.json()

        if (res.ok) return data.data

        console.error(data.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
}

export const getProductByHandle = cache(async function (
    handle: string
): Promise<IProduct | null> {
    const data = await getProducts({ handle, limit: 1 })

    if (!data || !data.length) return null

    return data[0]
})

export const getProductsOnSale = cache(async function (
    query: RequestQuery<IProduct> = {}
): Promise<IProduct[] | null> {
    try {
        const q = toQueryString(query)

        const res = await fetch(
            `${API_STORE_URL}/products/sale?${q}`,
            await getOptions(['products-sale'])
        )

        const data = await res.json()

        if (res.ok) {
            return data.data
        }

        console.error(data.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
})

export const searchProducts = cache(async function (
    query: string,
    countryCode: string,
    limit: number = 5
): Promise<IProduct[] | null> {
    const region = await getRegionByCountryCode(countryCode)

    if (!region) throw new Error('Invalid region')

    const q = toQueryString({ q: query, region: region._id, limit })

    try {
        const res = await fetch(
            `${API_STORE_URL}/products/search?${q}`,
            await getOptions(['search-products'])
        )

        const data = await res.json()

        if (res.ok) {
            return data.data
        }

        console.error(data.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
})
