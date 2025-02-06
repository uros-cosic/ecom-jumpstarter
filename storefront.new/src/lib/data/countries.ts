'use server'

import { cache } from 'react'

import { API_STORE_URL } from '@/lib/constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'
import { ICountry, RequestQuery } from '../types'

export const getCountryById = async (id: string): Promise<ICountry | null> => {
    try {
        const res = await fetch(
            `${API_STORE_URL}/countries/${id}`,
            await getOptions([`country-${id}`])
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

export const getCountries = cache(async function (
    query: RequestQuery<ICountry> = {}
): Promise<ICountry[] | null> {
    try {
        const q = toQueryString(query)

        const res = await fetch(
            `${API_STORE_URL}/countries?${q}`,
            await getOptions(['countries'])
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

export const getCountryByCode = async (
    code: string
): Promise<ICountry | null> => {
    const countries = await getCountries({ limit: 1, code: code.toLowerCase() })

    if (!countries) return null

    return countries[0] ?? null
}
