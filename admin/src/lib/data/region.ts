'use server'

import { cache } from 'react'
import { IRegion, RequestQuery } from '../types'
import { API_ADMIN_URL } from '../constants'
import { toQueryString } from '../utils'
import { getOptions } from './factory'

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
