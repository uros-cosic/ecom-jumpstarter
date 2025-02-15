'use server'

import { cache } from 'react'
import { IOrderAnalytics, ISiteAnalytics, RequestQuery } from '../types'
import { toQueryString } from '../utils'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'

export const getSiteAnalytics = cache(async function (
    query: RequestQuery<ISiteAnalytics> = {}
): Promise<ISiteAnalytics[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/analytics/site?${q}`,
            await getOptions(['site-analytics'])
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

export const getOrdersAnalytics = cache(async function (
    query: RequestQuery<IOrderAnalytics> = {}
): Promise<IOrderAnalytics[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/analytics/orders?${q}`,
            await getOptions(['orders-analytics'])
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
