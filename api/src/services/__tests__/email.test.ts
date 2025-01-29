import mongoose from 'mongoose'
import path from 'path'
import i18next from 'i18next'
import i18nextHttpMiddleware from 'i18next-http-middleware'
import i18nextFsBackend from 'i18next-fs-backend'

import '../../config'
import EmailService from '../email'
import User from '../../models/User'
import Region from '../../models/Region'
import Currency from '../../models/Currency'
import Address from '../../models/Address'
import ShippingMethod from '../../models/ShippingMethod'
import Cart, { ICart } from '../../models/Cart'
import Product, { PRODUCT_TYPE } from '../../models/Product'
import Order, { IOrder, PopulatedOrder } from '../../models/Order'
import PaymentMethod from '../../models/PaymentMethod'
import Discount, { DISCOUNT_TYPE } from '../../models/Discount'
import Newsletter from '../../models/Newsletter'
import Sale, { SALE_TYPE } from '../../models/Sale'

mongoose.connect(process.env.MONGO_URI!)

i18next
    .use(i18nextFsBackend)
    .use(i18nextHttpMiddleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        backend: {
            loadPath: path.join(
                process.cwd(),
                'storage',
                'locales',
                '{{lng}}',
                'translation.json'
            ),
        },
        detection: {
            order: ['querystring', 'header', 'cookie'],
            caches: ['cookie'],
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupHeader: 'accept-language',
        },
    })

beforeAll(async () => {
    const currency = await Currency.create({
        name: 'test',
        code: 'usd',
        symbol: 'test',
    })
    const region = await Region.create({
        name: 'test-region',
        currency: String(currency._id),
    })
    const user = await User.create({
        region: String(region._id),
        name: 'tester',
        email: 'test@mail.com',
        password: 'test1234',
    })
    const address = await Address.create({
        user: String(user._id),
        firstName: 'tester',
        lastName: 'tester',
        address: 'testaddr',
        city: 'testcity',
        country: 'testcountr',
        postalCode: 'testpc',
        phone: '123-456',
    })
    const shippingMethod = await ShippingMethod.create({
        region: String(region._id),
        name: 'test',
        cost: 100,
    })
    const product1 = await Product.create({
        name: 'test prod',
        description: 'test descr',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/product/zzz.jpg',
        images: ['http://localhost:5000/images/product/test.webp'],
        region: String(region._id),
        price: 555,
    })
    const product2 = await Product.create({
        name: 'test prod2',
        description: 'test descr',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/product/zzz.jpg',
        images: ['http://localhost:5000/images/product/test.webp'],
        region: String(region._id),
        price: 444,
    })
    const paymentMethod = await PaymentMethod.create({
        name: 'manual',
        region: String(region._id),
    })
    const cart = await Cart.create({
        region: String(region._id),
        items: [
            { product: String(product1._id), quantity: 10 },
            { product: String(product2._id) },
        ],
        shippingMethod: String(shippingMethod._id),
        address: String(address._id),
        paymentMethod: String(paymentMethod._id),
    })

    await Order.create({
        region: String(region._id),
        cart: String(cart._id),
    })

    await Discount.create({
        code: 'test10',
        type: DISCOUNT_TYPE.PERCENTAGE,
        percentage: 0.1,
    })

    await Newsletter.create({
        region: String(region._id),
        email: 'test@mail.com',
    })

    await Sale.create({
        name: 'testsale',
        products: [String(product1._id)],
        type: SALE_TYPE.PERCENTAGE,
        region: String(region._id),
        thumbnail: 'http://localhost:5000/images/sale/test.webp',
        discountPercentage: 0.25,
    })
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
})

describe('Email service', () => {
    test('Welcome email mail test', async () => {
        const user = await User.findOne({})
        const html = await EmailService.sendWelcomeMail(user!.toObject())

        expect(html).toBeDefined()
        expect(typeof html).toBe('string')
    })

    test('Order confirmation mail test', async () => {
        const order = await Order.findOne({})
            .populate('cart')
            .populate('cart.address')
            .populate('cart.shippingMethod')

        const html = await EmailService.sendOrderConfirmationMail(
            order!.toObject() as unknown as PopulatedOrder
        )

        expect(html).toBeDefined()
        expect(typeof html).toBe('string')
    })

    test('Order fulfillment mail test', async () => {
        const order = await Order.findOne({}).populate('cart')

        const html = await EmailService.sendOrderFulfillmentMail(
            order!.toObject() as unknown as Omit<IOrder, 'cart'> & {
                cart: ICart
            }
        )

        expect(html).toBeDefined()
        expect(typeof html).toBe('string')
    })

    test('Cart abandonment mail test', async () => {
        const discount = await Discount.findOne({})
        const cart = await Cart.findOne({})

        const html = await EmailService.sendCartAbandonmentEmail(
            cart!.toObject(),
            discount!.toObject()
        )

        expect(html).toBeDefined()
        expect(typeof html).toBe('string')
    })

    test('Newsletter welcome mail test', async () => {
        const discount = await Discount.findOne({})
        const newsletter = await Newsletter.findOne({})

        const html = await EmailService.sendNewsletterWelcomeMail(
            newsletter!.toObject(),
            discount!.toObject()
        )

        expect(html).toBeDefined()
        expect(typeof html).toBe('string')
    })

    test('Sale info mail test', async () => {
        const sale = await Sale.findOne({})

        const html = await EmailService.sendSaleInfoMail(sale!.toObject(), [
            'test@mail.com',
        ])

        expect(html).toBeDefined()
        expect(typeof html).toBe('string')
    })
})
