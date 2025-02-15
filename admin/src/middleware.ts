import { NextRequest, NextResponse } from 'next/server'

import { USER_ROLE } from './lib/types'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const cookieOptions: Partial<ResponseCookie> = {
    httpOnly: true,
    sameSite: 'lax',
}

if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
    cookieOptions.sameSite = 'none'
}

const getMe = async function (
    token: string,
    response: NextResponse,
    refreshToken?: string
) {
    if (!API_URL) throw new Error('No api url provided')

    try {
        const res = await fetch(`${API_URL}/api/admin/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: {
                revalidate: 3600,
            },
        })

        const data = await res.json()

        if (res.ok) {
            return data.data
        }

        if (res.status === 401) {
            // token expired
            if (!refreshToken) return null

            const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                    Authorization: `RefreshToken ${refreshToken}`,
                },
            })

            const refreshData = await refreshRes.json()

            if (refreshRes.ok) {
                response.cookies.set('jwt', refreshData.token, cookieOptions)
                return refreshData.data
            }

            console.error(refreshData.message)
            return null
        }

        console.error(data.message)
        return null
    } catch (e) {
        console.error(e)
        return null
    }
}

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()

    const jwt = request.cookies.get('jwt')?.value

    const urlHasLogin = request.nextUrl.pathname === '/login'

    if (!jwt) {
        if (urlHasLogin) return response

        const redirectUrl = `${request.nextUrl.origin}/login`
        return NextResponse.redirect(redirectUrl, 307)
    }

    const user = await getMe(
        jwt,
        response,
        request.cookies.get('refreshToken')?.value
    )

    if (!user || user.role !== USER_ROLE.ADMIN) {
        if (urlHasLogin) return response

        const redirectUrl = `${request.nextUrl.origin}/login`

        return NextResponse.redirect(redirectUrl, 307)
    }

    if (urlHasLogin) {
        const res = NextResponse.redirect(`${request.nextUrl.origin}`, 307)

        res.cookies.set(
            'jwt',
            response.cookies.get('jwt')?.value ??
                request.cookies.get('jwt')?.value ??
                '',
            cookieOptions
        )

        return res
    }

    return response
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)',
    ],
}
