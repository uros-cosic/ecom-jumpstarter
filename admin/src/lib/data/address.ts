'use server'

import { cache } from 'react'
import { IAddress } from '../types'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'

export const getAddressById = cache(async function (
    id: IAddress['_id']
): Promise<IAddress | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/addresses/${id}`,
            await getOptions([`address-${id}`])
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
