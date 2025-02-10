'use server'

import { cache } from 'react'
import { API_STORE_URL } from '../constants'
import { getOptions } from './factory'
import { IAddress } from '../types'
import { createAddressFormSchemaValues } from '../forms/address'
import { revalidateTag } from 'next/cache'

/**
 * Gets last 5 created addresses for the current user
 */
export const getMyAddresses = cache(async function (): Promise<
    IAddress[] | null
> {
    try {
        const res = await fetch(
            `${API_STORE_URL}/addresses/myAddresses`,
            await getOptions(['user-addresses'])
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
 * Creates new address for the current user
 * Returns tuple representing [data, null]
 */
export const createAddress = async function (
    values: createAddressFormSchemaValues
): Promise<[IAddress | null, string | null]> {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_STORE_URL}/addresses`, {
            method: 'POST',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag('user-addresses')
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Deletes users address by id
 * Returns tuple representing [isDeleted, error]
 */
export const deleteAddress = async function (
    id: string
): Promise<[boolean | null, string | null]> {
    try {
        const options = await getOptions()
        const res = await fetch(`${API_STORE_URL}/addresses/${id}`, {
            method: 'DELETE',
            ...options,
        })

        if (res.ok) {
            revalidateTag('user-addresses')
            return [true, null]
        }

        const data = await res.json()

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
