'use server'

import { cache } from 'react'
import { IPayment } from '../types'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'

export const getPaymentById = cache(async function (
    id: IPayment['_id']
): Promise<IPayment | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/payments/${id}`,
            await getOptions([`payment-${id}`])
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
