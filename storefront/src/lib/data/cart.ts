import { cookies } from 'next/headers'
import { API_STORE_URL, DEFAULT_REGION } from '../constants'
import { getOptions } from './factory'
import { ICart } from '../types'
import { getMe } from './user'
import { getRegionByCountryCode } from './regions'

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

export const getCart = async (): Promise<ICart | null> => {
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

export const getOrSetCart = async (): Promise<ICart | null> => {
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

        if (res.ok) return cartData.data

        console.error(cartData.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
}
