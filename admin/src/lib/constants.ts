export const BACKEND_URL =
    typeof window !== 'object'
        ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        : 'http://localhost:5000'
export const API_URL = `${BACKEND_URL}/api`
export const API_ADMIN_URL = `${API_URL}/admin`
export const API_AUTH_URL = `${API_URL}/auth`
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5001'

export const locale = 'en'
export const currency = 'usd'

export const STORE = {
    name: 'Ecom jumpstarter',
}
