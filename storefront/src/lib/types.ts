export type ValidResponse<T> = {
    data: T
}

export type ErrorResponse = {
    message: string
}

export type RequestQuery<T> = {
    page?: number
    sort?: string
    limit?: number
    fields?: string
} & Partial<T>

export interface IBaseModel {
    _id: string
    createdAt: Date
    updatedAt: Date
}

export enum PRODUCT_TYPE {
    DIGITAL = 'digital',
    SERVICE = 'service',
    PRODUCT = 'product',
}

export interface IProductOptions extends IBaseModel {
    name: string
    values: string[]
}

export interface IProductOption extends IBaseModel {
    name: string
    value: string
}

export interface IProductVariant extends IBaseModel {
    title: string
    options: IProductOption[]
    sku?: string
    barcode?: string
    ean?: string
    upc?: string
    hsCode?: string
    midCode?: string
    originCountry?: string
    weight?: string
    length?: string
    height?: string
    width?: string
    material?: string
    price: number
    quantity: number
}

export interface IProduct extends IBaseModel {
    name: string
    description: string
    details?: string
    keywords: string[]
    handle: string
    type: PRODUCT_TYPE
    thumbnail: string
    images: string[]
    productCategory?: string
    productCollection?: string
    options?: IProductOptions[]
    variants?: IProductVariant[]
    region: string
    sizeGuide?: string
    price: number
    quantity: number
    active: boolean
    metadata: Record<string, string>
}

export interface ICartItem extends IBaseModel {
    product: string
    variant?: string
    quantity: number
}

export interface ICart extends IBaseModel {
    customer?: string
    items: ICartItem[]
    region: string
    address?: string
    email?: string
    shippingMethod?: string
    paymentMethod?: string
    discountCode?: string
    totalPrice: number
}

export interface IRegion extends IBaseModel {
    name: string
    currency: string
    countries: string[]
    defaultLocale: string
    taxRate: number
    metadata: Record<string, string>
}

export interface ICountry extends IBaseModel {
    name: string
    code: string
    currency: string
    languages: string[]
}

export interface IProductCategory extends IBaseModel {
    name: string
    description: string
    handle: string
    region: string
    keywords: string[]
    parentCategory?: string
    metadata: Record<string, string>
}

export interface IProductCollection extends IBaseModel {
    name: string
    description: string
    handle: string
    region: string
    keywords: string[]
    metadata: Record<string, string>
}

export interface INewsletter extends IBaseModel {
    email: string
    region: string
    canceledAt?: Date | null
    active: boolean
}
