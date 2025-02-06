import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

import { BACKEND_URL } from '@/lib/constants'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: BACKEND_URL,
            },
        ],
    },
}

export default withNextIntl(nextConfig)
