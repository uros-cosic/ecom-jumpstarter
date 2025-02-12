'use server'

import { API_STORE_URL } from '../constants'
import { IPayment } from '../types'
import { getOptions } from './factory'

export const getPaymentById = async (id: string): Promise<IPayment | null> => {
    try {
        const res = await fetch(
            `${API_STORE_URL}/payments/${id}`,
            await getOptions()
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
