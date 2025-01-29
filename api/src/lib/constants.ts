const url = 'http://localhost:3000'

export const COLORS = {
    primary: '#000',
    primaryForeground: '#fff',
} as const

export const STORE = {
    name: 'Store name',
    link: url,
    contactLink: `${url}/contact`,
    orderPreviewLink: `${url}/orders/{{id}}`,
    saleLink: `${url}/sales/{{id}}`,
} as const
