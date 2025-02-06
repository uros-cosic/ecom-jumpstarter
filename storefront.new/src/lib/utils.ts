import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RequestQuery } from './types'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface IJsonLdSchema {
    id: string
    type: 'product' | 'blog'
    data: {
        product?: {
            name: string
            description: string
            image: string
            currency: string
            price: number
            storeName: string
            locale: string
        }
        blog?: {
            title: string
            description: string
            image: string
            author: string
            keywords: string
            storeName: string
            publishedDate: Date
            modifiedDate: Date
            url: string
            locale: string
        }
    }
}

export const generateJsonLdSchema = ({ type, data }: IJsonLdSchema) => {
    switch (type) {
        case 'product':
            const product = data.product!
            return {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                description: product.description,
                image: product.image,
                offers: {
                    '@type': 'Offer',
                    priceCurrency: product.currency,
                    price: product.price,
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: 'https://schema.org/InStock',
                    seller: {
                        '@type': 'Organization',
                        name: 'Big Bite Store',
                    },
                },
                inLanguage: product.locale,
                isFamilyFriendly: 'true',
            }
        case 'blog':
            const blog = data.blog!
            return {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: blog.title,
                description: blog.description,
                image: blog.image,
                keywords: blog.keywords,
                author: {
                    '@type': 'Person',
                    name: blog.author,
                },
                publisher: {
                    '@type': 'Organization',
                    name: blog.storeName,
                },
                datePublished: blog.publishedDate,
                dateModified: blog.modifiedDate,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': blog.url,
                },
                inLanguage: blog.locale,
                isFamilyFriendly: 'true',
            }
        default:
            return null
    }
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
