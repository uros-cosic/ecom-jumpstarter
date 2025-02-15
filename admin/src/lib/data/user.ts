import { cache } from 'react'
import { API_ADMIN_URL } from '../constants'
import { IUser, RequestQuery } from '../types'
import { getOptions } from './factory'
import { toQueryString } from '../utils'

export const getMe = async (): Promise<IUser | null> => {
    try {
        const res = await fetch(
            `${API_ADMIN_URL}/users/me`,
            await getOptions(['user'])
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

export const getUsers = cache(async function (
    query: RequestQuery<IUser> = {}
): Promise<IUser[] | null> {
    try {
        const q = toQueryString(query)
        const res = await fetch(
            `${API_ADMIN_URL}/users?${q}`,
            await getOptions(['users'])
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
