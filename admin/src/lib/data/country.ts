'use server'

import { cache } from 'react'
import { ICountry, RequestQuery } from '../types'
import { API_ADMIN_URL } from '../constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'

export const getCountries = cache(async function (
    query: RequestQuery<ICountry> = {}
): Promise<ICountry[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/countries?${q}`,
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

export const getCountryById = cache(async function (
    id: ICountry['_id']
): Promise<ICountry | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/countries/${id}`,
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
})
