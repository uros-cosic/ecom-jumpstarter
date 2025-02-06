export const BACKEND_URL = 'http://localhost:5000'
export const API_URL = `${BACKEND_URL}/api`
export const API_STORE_URL = `${API_URL}/store`
export const API_AUTH_URL = `${API_URL}/auth`

export const DEFAULT_REGION = 'us'

export const locales = ['en'] as const

export const STORE = {
    name: 'Ecom jumpstarter',
    baseUrl: 'http://localhost:3000',
} as const
