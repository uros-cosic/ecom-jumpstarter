import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL
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
    const { regions, updatedAt } = regionCache

    if (!BACKEND_URL) {
        throw new Error('No backend url provided')
    }

    if (!Object.keys(regions).length || updatedAt < Date.now() - 3600 * 1000) {
        const res = await fetch(`${BACKEND_URL}/api/store/regions?limit=999`, {
            next: {
                revalidate: 3600,
                tags: ['regions'],
            },
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message)

        const fetchedRegions = data.data

        if (!fetchedRegions?.length) {
            throw new Error('No regions found while fetching')
        }

        const countryIds = []

        for (const region of fetchedRegions) {
            countryIds.push(region.countries)
        }

        const uniqueCountries = new Set(countryIds.flat())

        const countriesRes = await Promise.all(
            Array.from(uniqueCountries).map((id) =>
                fetch(`${BACKEND_URL}/api/store/countries/${id}`)
            )
        )

        const countries = await Promise.all(countriesRes.map((c) => c.json()))

        for (const country of countries.map((c) => c.data).filter((c) => !!c))
            regionCache.regions[country.code] = true

        regionCache.updatedAt = Date.now()
    }

    return regionCache.regions
}

async function getCountryCode(
    request: NextRequest,
    regionCache: Record<string, boolean>
) {
    try {
        let countryCode

        const vercelCountryCode = request.headers
            .get('x-vercel-ip-country')
            ?.toLowerCase()

        const urlCountryCode = request.nextUrl.pathname
            .split('/')[1]
            ?.toLowerCase()

        const countryCodeCookie = request.cookies.get('countryCode')?.value

        if (urlCountryCode && regionCache[urlCountryCode]) {
            countryCode = urlCountryCode
        } else if (vercelCountryCode && regionCache[vercelCountryCode]) {
            countryCode = vercelCountryCode
        } else if (countryCodeCookie && regionCache[countryCodeCookie]) {
            countryCode = countryCodeCookie
        } else if (regionCache[DEFAULT_REGION]) {
            countryCode = DEFAULT_REGION
        } else if (Object.keys(regionCache)[0]) {
            countryCode = Object.keys(regionCache)[0]
        }

        return countryCode
    } catch (e) {
        console.error(e)
    }
}

export async function middleware(request: NextRequest) {
    let redirectUrl = request.nextUrl.href

    let response = NextResponse.redirect(redirectUrl, 307)

    const regionCache = await getRegionsCache()

    const countryCode =
        regionCache && (await getCountryCode(request, regionCache))

    const urlHasCountryCode =
        countryCode &&
        request.nextUrl.pathname.split('/')[1].includes(countryCode)

    response.cookies.set('countryCode', countryCode ?? DEFAULT_REGION)

    if (urlHasCountryCode) {
        response = NextResponse.next()

        response.cookies.set('countryCode', countryCode ?? DEFAULT_REGION)

        return response
    }

    if (request.nextUrl.pathname.includes('.')) {
        return NextResponse.next()
    }

    const redirectPath =
        request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname

    const queryString = request.nextUrl.search ? request.nextUrl.search : ''

    if (!urlHasCountryCode && countryCode) {
        redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
        response = NextResponse.redirect(`${redirectUrl}`, 307)
        response.cookies.set('countryCode', countryCode ?? DEFAULT_REGION)
    }

    return response
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)',
    ],
}
