import type { NextConfig } from 'next'

import { BACKEND_URL } from '@/lib/constants'

const nextConfig: NextConfig = {
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'http',
                hostname: 'api',
            },
            {
                protocol: 'https',
                hostname: BACKEND_URL,
            },
        ],
    },
}

export default nextConfig
