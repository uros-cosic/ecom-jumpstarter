import 'server-only'

import { cookies } from 'next/headers'
import { getLocale } from 'next-intl/server'

export const getOptions = async (tags: string[] = []) => {
    const options = {
        headers: {
            Authorization: '',
            'Accept-Language': '',
        },
        next: {
            tags,
        },
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value
    const locale = await getLocale()

    if (token) options.headers.Authorization = `Bearer ${token}`
    options.headers['Accept-Language'] = locale

    return options
}
