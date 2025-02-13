import { NextRequest, NextResponse } from 'next/server'
import { IRegion } from './lib/types'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.BACKEND_URL
const DEFAULT_REGION = process.env.DEFAULT_REGION ?? 'us'

interface IRegionCache {
    regions: Record<string, boolean>
    updatedAt: number
}

const regionCache: IRegionCache = {
    regions: {},
    updatedAt: Date.now(),
}

async function getRegionsCache() {
    if (!BACKEND_URL) {
        throw new Error('No backend url provided')
    }

    if (
        !Object.keys(regionCache.regions).length ||
        regionCache.updatedAt < Date.now() - 3600 * 1000
    ) {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/store/regions?limit=999`,
                {
                    next: { revalidate: 3600, tags: ['regions'] },
                }
            )

            if (!res.ok)
                throw new Error(`Failed to fetch regions: ${res.status}`)

            const data = await res.json()
            const fetchedRegions = data?.data ?? []

            if (!fetchedRegions.length) {
                throw new Error('No regions found while fetching')
            }

            const countryIds = fetchedRegions.flatMap(
                (region: IRegion) => region.countries
            )
            const uniqueCountries = Array.from(new Set(countryIds))

            const countryResponses = await Promise.allSettled(
                uniqueCountries.map((id) =>
                    fetch(`${BACKEND_URL}/api/store/countries/${id}`)
                )
            )

            countryResponses.forEach((result) => {
                if (result.status === 'fulfilled') {
                    result.value.json().then((data) => {
                        if (data?.data?.code) {
                            regionCache.regions[data.data.code] = true
                        }
                    })
                }
            })

            regionCache.updatedAt = Date.now()
        } catch (error) {
            console.error('Error fetching regions:', error)
            return {}
        }
    }

    if (!regionCache.regions[DEFAULT_REGION]) {
        regionCache.regions[DEFAULT_REGION] = true
    }

    return regionCache.regions
}

async function getCountryCode(
    request: NextRequest,
    regionCache: Record<string, boolean>
) {
    try {
        const vercelCountryCode = request.headers
            .get('x-vercel-ip-country')
            ?.toLowerCase()
        const urlCountryCode = request.nextUrl.pathname
            .split('/')[1]
            ?.toLowerCase()
        const countryCodeCookie = request.cookies.get('countryCode')?.value

        if (urlCountryCode && regionCache[urlCountryCode]) {
            return urlCountryCode
        } else if (vercelCountryCode && regionCache[vercelCountryCode]) {
            return vercelCountryCode
        } else if (countryCodeCookie && regionCache[countryCodeCookie]) {
            return countryCodeCookie
        } else if (regionCache[DEFAULT_REGION]) {
            return DEFAULT_REGION
        } else if (Object.keys(regionCache).length > 0) {
            return Object.keys(regionCache)[0]
        }

        return DEFAULT_REGION
    } catch (e) {
        console.error(e)
        return DEFAULT_REGION
    }
}

export async function middleware(request: NextRequest) {
    const regionCache = await getRegionsCache()
    const countryCode = await getCountryCode(request, regionCache)

    const response = NextResponse.next()
    response.cookies.set('countryCode', countryCode)

    const urlHasCountryCode =
        request.nextUrl.pathname.split('/')[1] === countryCode

    if (urlHasCountryCode) {
        return response
    }

    if (request.nextUrl.pathname.includes('.')) {
        return response
    }

    const redirectPath =
        request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname
    const queryString = request.nextUrl.search ? request.nextUrl.search : ''
    const redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`

    return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)',
    ],
}
