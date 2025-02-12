export type ValidResponse<T> = {
    data: T
}

export type ErrorResponse = {
    message: string
    test?: string[] | null
}

export type RequestQuery<T> = {
    page?: number | null
    sort?: string | null
    limit?: number | null
    fields?: string | null
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
    sku?: string | null
    barcode?: string | null
    ean?: string | null
    upc?: string | null
    hsCode?: string | null
    midCode?: string | null
    originCountry?: string | null
    weight?: string | null
    length?: string | null
    height?: string | null
    width?: string | null
    material?: string | null
    price: number
    quantity: number
}

export interface IProduct extends IBaseModel {
    name: string
    description: string
    details?: string | null
    keywords: string[]
    handle: string
    type: PRODUCT_TYPE
    thumbnail: string
    images: string[]
    productCategory?: string | null
    productCollection?: string | null
    options?: IProductOptions[] | null
    variants?: IProductVariant[] | null
    region: string
    sizeGuide?: string | null
    price: number
    quantity: number
    active: boolean
    metadata: Record<string, string>
}

export interface ICartItem extends IBaseModel {
    product: string
    variant?: string | null
    quantity: number
}

export interface ICart extends IBaseModel {
    customer?: string | null
    items: ICartItem[]
    region: string
    address?: string | null
    email?: string | null
    shippingMethod?: string | null
    paymentMethod?: string | null
    discountCode?: string | null
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
    parentCategory?: string | null
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

export enum USER_ROLE {
    ADMIN = 'admin',
    USER = 'user',
}

export interface IUser extends IBaseModel {
    name: string
    email: string
    password: string
    role: USER_ROLE
    cart: string
    region: string
    passwordChangedAt?: Date | null
    resetPasswordToken?: string | null
    resetPasswordExpires?: Date | null
    googleId?: string | null
    active: boolean
}

export enum AUTOMATED_PAYMENT_METHODS {
    MANUAL = 'manual',
    STRIPE = 'stripe',
}

export enum ORDER_STATUS {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELED = 'canceled',
}

export enum ORDER_FULFILLMENT_STATUS {
    NOT_FULFILLED = 'not fulfilled',
    FULFILLED = 'fulfilled',
    PARTIALLY_FULFILLED = 'partially fulfilled',
    SHIPPED = 'shipped',
    PARTIALLY_SHIPPED = 'partially shipped',
    RETURNED = 'returned',
    PARTIALLY_RETURNED = 'partially returned',
    CANCELED = 'canceled',
}

export interface IOrder extends IBaseModel {
    customer?: string | null
    cart: string
    payment?: string | null
    status: ORDER_STATUS
    fulfillmentStatus: ORDER_FULFILLMENT_STATUS
    region: string
    stripeSessionUrl?: string | null
}

export interface IAddress extends IBaseModel {
    user?: string | null
    company?: string | null
    firstName: string
    lastName: string
    address: string
    city: string
    country: string
    province?: string | null
    postalCode: string
    phone: string
}

export enum DISCOUNT_TYPE {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
}

export interface IDiscount extends IBaseModel {
    code: string
    type: DISCOUNT_TYPE
    amount?: number | null
    percentage?: number | null
    usageLimit: number
    usageCount: number
    validFrom?: Date | null
    validTo?: Date | null
    metadata: Record<string, string>
}

export interface IShippingMethod extends IBaseModel {
    name: string
    cost: number
    region: string
}

export interface IPaymentMethod extends IBaseModel {
    name: string
    region: string
    metadata: Record<string, string>
}

export enum PAYMENT_STATUS {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export interface IPayment extends IBaseModel {
    method: string
    amount: number
    status: PAYMENT_STATUS
}

export enum CHECKOUT_STEP {
    ADDRESS = 'address',
    DELIVERY = 'delivery',
    PAYMENT = 'payment',
    REVIEW = 'review',
}
