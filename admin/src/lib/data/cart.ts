'use server'

import { cache } from 'react'
import { ICart, ICartItem, IProduct } from '../types'
import { API_ADMIN_URL } from '../constants'
import { getOptions } from './factory'

export type PopulatedCartItem = Omit<ICartItem, 'product'> & {
    product: IProduct
}

export type ProductPopulatedCart = Omit<ICart, 'items'> & {
    items: PopulatedCartItem[]
}

export const getCartById = cache(async function (
    id: ICart['_id']
): Promise<ProductPopulatedCart | null> {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/carts/${id}`,
            await getOptions([`cart-${id}`])
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
