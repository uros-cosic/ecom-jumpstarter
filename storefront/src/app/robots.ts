import { STORE } from '@/lib/constants'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/account', '/checkout', '/orders'],
            },
        ],
        sitemap: `${STORE.baseUrl}/sitemap.xml`,
    }
}
