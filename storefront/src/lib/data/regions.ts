'use server'

import { cache } from 'react'

import { API_STORE_URL } from '../constants'
import { IRegion, RequestQuery } from '../types'
import { toQueryString } from '../utils'
import { getCountryByCode } from './countries'
import { getOptions } from './factory'

export const getRegions = cache(
    async (query: RequestQuery<IRegion> = {}): Promise<IRegion[] | null> => {
        try {
            const q = toQueryString(query)

            const res = await fetch(
                `${API_STORE_URL}/regions?${q}`,
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
    }
)

export const getRegionById = cache(async function (
    id: string
): Promise<IRegion | null> {
    try {
        const res = await fetch(
            `${API_STORE_URL}/regions/${id}`,
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

export const getRegionByCountryCode = cache(
    async (countryCode: string): Promise<IRegion | null> => {
        try {
            const country = await getCountryByCode(countryCode)

            if (!country) throw new Error(`No country with code ${countryCode}`)

            const res = await fetch(
                `${API_STORE_URL}/regions?countries=${country._id}`,
                await getOptions([`regions-${country._id}`])
            )

            const data = await res.json()

            if (res.ok) return data.data[0] ?? null

            console.error(data.message)
            return null
        } catch (e) {
            console.error(e)
            return null
        }
    }
)
