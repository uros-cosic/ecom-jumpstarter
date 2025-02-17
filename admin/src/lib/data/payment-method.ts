'use server'

import { cache } from 'react'
import { IPaymentMethod } from '../types'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'

export const getPaymentMethodById = cache(async function (
    id: IPaymentMethod['_id']
): Promise<IPaymentMethod | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/paymentMethods/${id}`,
            await getOptions([`payment-method-${id}`])
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
