const STOREFRONT_URL = 'http://localhost:3000'

export const COLORS = {
    primary: '#000',
    primaryForeground: '#fff',
} as const

export const STORE = {
    name: 'Store name',
    link: STOREFRONT_URL,
    contactLink: `${STOREFRONT_URL}/contact`,
    orderPreviewLink: `${STOREFRONT_URL}/orders/{{id}}`,
    saleLink: `${STOREFRONT_URL}/sales/{{id}}`,
    cancelUrl: `${STOREFRONT_URL}/orders/cancel`,
    passwordResetUrl: `${STOREFRONT_URL}/password-reset/{{token}}`,
} as const
