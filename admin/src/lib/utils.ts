import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RequestQuery } from './types'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function toQueryString<T>(query: RequestQuery<T>) {
    const params = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value))
        }
    })

    return params.toString()
}

export const formatDate = (date: Date | string, locale: string): string => {
    return new Date(date).toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export const formatCurrency = (
    locale: string,
    currency: string,
    amount: number
) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount)
}
