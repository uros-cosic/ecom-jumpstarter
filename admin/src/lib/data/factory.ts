'use server'

import { cookies } from 'next/headers'

export const getOptions = async (tags: string[] = []) => {
    const options = {
        headers: {
            Authorization: '',
        },
        next: {
            tags,
        },
    }

    const cookieStore = await cookies()

    const token = cookieStore.get('jwt')?.value

    if (token) options.headers.Authorization = `Bearer ${token}`

    return options
}
