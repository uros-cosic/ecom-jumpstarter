'use server'

import { cache } from 'react'

import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'
import { IDiscount } from '../types'

export const getDiscountCodeById = cache(async function (
    id: string
): Promise<IDiscount | null> {
    try {
        const res = await fetch(
            `${API_STORE_URL}/discounts/${id}`,
            await getOptions([`discount-${id}`])
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
 * Gets discount by code
 * Retunrs tuple representing [data, err]
 */
export const getDiscountCodeByCode = async (
    code: string
): Promise<[IDiscount | null, string | null]> => {
    try {
        const res = await fetch(`${API_STORE_URL}/discounts/code?code=${code}`)

        const data = await res.json()

        if (res.ok) return [data.data, null]

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
