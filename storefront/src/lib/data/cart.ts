'use server'

import { cookies } from 'next/headers'
import { API_STORE_URL, DEFAULT_REGION } from '../constants'
import { getOptions } from './factory'
import { ICart, ICartItem, IProduct } from '../types'
import { getMe } from './user'
import { getRegionByCountryCode } from './regions'
import { revalidateTag } from 'next/cache'

export const getCartId = async () => {
    return (await cookies()).get('cart_id')?.value
}

export const setCartId = async (cartId: string) => {
    ;(await cookies()).set('cart_id', cartId, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })
}

export const removeCartId = async () => {
    ;(await cookies()).set('cart_id', '', { maxAge: -1 })
}

type PopulatedCartItem = Omit<ICartItem, 'product'> & { product: IProduct }

export type ProductPopulatedCart = Omit<ICart, 'items'> & {
    items: PopulatedCartItem[]
}

export const getCart = async (): Promise<ProductPopulatedCart | null> => {
    const cartId = await getCartId()

    if (!cartId) return null

    try {
        const res = await fetch(
            `${API_STORE_URL}/carts/${cartId}`,
            await getOptions([`cart-${cartId}`])
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

export const getOrSetCart = async (): Promise<
    ProductPopulatedCart | ICart | null
> => {
    const countryCode =
        (await cookies()).get('countryCode')?.value ?? DEFAULT_REGION

    const cartRes = await getCart()

    if (cartRes) return cartRes

    try {
        const currentUser = await getMe()
        const region = await getRegionByCountryCode(countryCode)

        if (!region) throw new Error('Invalid region')

        const data: Partial<ICart> = {}

        data.region = region._id
        if (currentUser) data.customer = currentUser._id

        const options = await getOptions()

        const res = await fetch(`${API_STORE_URL}/carts`, {
            method: 'POST',
            headers: { ...options.headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        const cartData = await res.json()

        if (res.ok) {
            await setCartId(cartData.data._id)
            return cartData.data
        }

        console.error(cartData.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
}

/**
 * Adds/Removes item to cart
 * To remove just set items quantity to 0
 * Returns tuple representing [data, err]
 */
export const addToCart = async (
    item: Omit<ICartItem, '_id' | 'createdAt' | 'updatedAt'>
): Promise<[ICart | null, string | null]> => {
    try {
        const cart = (await getOrSetCart()) as ICart

        if (!cart) throw new Error('No cart')

        const items = cart.items
        let found = false
        const isPopulated = !cart.items.length
            ? false
            : typeof cart.items[0].product !== 'string'

        for (const i of items) {
            if (!isPopulated) {
                if (i.product === item.product && i.variant === item.variant) {
                    i.quantity += item.quantity
                    found = true
                    break
                }
            } else {
                i.product = (i.product as unknown as IProduct)._id
                if (i.product === item.product && i.variant === item.variant) {
                    i.quantity += item.quantity
                    found = true
                }
            }
        }

        if (!found) items.push(item as ICartItem)

        const [data, err] = await updateCart({
            items: items.filter((i) => i.quantity > 0),
        })

        if (err) return [null, err]

        return [data, null]
    } catch (e) {
        return [null, String(e)]
    }
}

/**
 * Updates the current cart
 * Returns tuple representing [data, err]
 */
export const updateCart = async (
    values: Partial<ICart>
): Promise<[ICart | null, string | null]> => {
    try {
        const cart = await getOrSetCart()

        if (!cart) throw new Error('No cart')

        const options = await getOptions()
        const res = await fetch(`${API_STORE_URL}/carts/${cart._id}`, {
            method: 'PATCH',
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })

        const data = await res.json()

        if (res.ok) {
            revalidateTag(`cart-${cart._id}`)
            return [data.data, null]
        }

        return [null, data.message]
    } catch (e) {
        return [null, String(e)]
    }
}
