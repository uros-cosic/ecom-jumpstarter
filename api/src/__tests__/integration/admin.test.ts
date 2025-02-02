import mongoose from 'mongoose'
import request from 'supertest'

import { server, app } from '../../index'
import User, { USER_ROLE } from '../../models/User'
import Currency from '../../models/Currency'
import Country from '../../models/Country'
import Region from '../../models/Region'
import PaymentMethod from '../../models/PaymentMethod'
import Order, { AUTOMATED_PAYMENT_METHODS } from '../../models/Order'
import ShippingMethod from '../../models/ShippingMethod'
import Product, { PRODUCT_TYPE } from '../../models/Product'
import Cart from '../../models/Cart'
import Address from '../../models/Address'
import ProductReview from '../../models/ProductReview'
import ProductCategory from '../../models/ProductCategory'
import ProductCollection from '../../models/ProductCollection'

const mockAdminUser = {
    role: USER_ROLE.ADMIN,
    email: 'test@mail.com',
    name: 'tester',
    password: 'test1234',
}

const mockUser = {
    email: 'test2@mail.com',
    name: 'tester',
    password: 'test1234',
}

beforeAll(async () => {
    const currency = await Currency.create({
        name: 'test-currency',
        code: 'usd',
        symbol: '$',
    })
    const country = await Country.create({
        name: 'test-country',
        iso_2: 'sr',
    })
    const region = await Region.create({
        name: 'test-region',
        currency: String(currency._id),
        countries: [String(country._id)],
    })
    const user = await User.create({ ...mockUser, region: String(region._id) })
    await User.create({ ...mockAdminUser, region: String(region._id) })

    const address = await Address.create({
        user: String(user._id),
        firstName: 'tester',
        lastName: 'tester',
        address: 'test addy',
        city: 'test city',
        country: 'test country',
        postalCode: '123456',
        phone: '123-456',
    })

    const paymentMethod = await PaymentMethod.create({
        name: AUTOMATED_PAYMENT_METHODS.MANUAL,
        region: String(region._id),
    })

    const shippingMethod = await ShippingMethod.create({
        name: 'test-shipping',
        cost: 500,
        region: String(region._id),
    })

    const product = await Product.create({
        name: 'test-prod',
        description: 'test-descr',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/product/test.webp',
        images: ['http://localhost:5000/images/product/test.webp'],
        region: String(region._id),
        price: 500,
    })

    const cart = await Cart.create({
        customer: String(user._id),
        items: [{ product: String(product._id), quantity: 10 }],
        region: String(region._id),
        address: String(address._id),
        email: user.email,
        paymentMethod: String(paymentMethod._id),
        shippingMethod: String(shippingMethod._id),
    })

    const order = await Order.create({
        cart: String(cart._id),
        region: String(region._id),
    })

    await ProductReview.create({
        product: String(product._id),
        customer: String(user._id),
        order: String(order._id),
        rating: 5,
        region: String(region._id),
    })

    await ProductCategory.create({
        name: 'test-ctg',
        description: 'test-ctg',
    })

    await ProductCollection.create({
        name: 'test-coll',
        description: 'test-desc',
    })
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Admin routes', () => {
    describe('GET /admin/users', () => {
        it('Should get all users', async () => {
            const loginRes = await request(app).post('/api/auth/login').send({
                email: mockAdminUser.email,
                password: mockAdminUser.password,
            })

            expect(loginRes.status).toBe(200)
            const token = loginRes.body.token
            expect(token).toBeDefined()

            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveLength(2) // 2 mock user
        })

        it('Should not allow unauth user to get users', async () => {
            const res = await request(app).get('/api/admin/users')

            expect(res.status).toBe(401)
            expect(res.body).toHaveProperty('message')
        })

        it('Should not allow non admin user to get users', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: mockUser.email, password: mockUser.password })

            expect(loginRes.status).toBe(200)
            const token = loginRes.body.token
            expect(token).toBeDefined()

            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(403)
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('POST /admin/users', () => {
        it('Should create new user', async () => {
            const loginRes = await request(app).post('/api/auth/login').send({
                email: mockAdminUser.email,
                password: mockAdminUser.password,
            })

            expect(loginRes.status).toBe(200)
            const token = loginRes.body.token
            expect(token).toBeDefined()

            const region = await Region.findOne({})

            const res = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    email: 'test3@mail.com',
                    password: 'test1234',
                    region: String(region!._id),
                    name: 'tester',
                })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('data')
        })

        it('Should not allow to create new user for non auth', async () => {
            const res = await request(app).post('/api/admin/users')

            expect(res.status).toBe(401)
            expect(res.body).toHaveProperty('message')
        })

        it('Should not create new user with non admin', async () => {
            const loginRes = await request(app).post('/api/auth/login').send({
                email: mockUser.email,
                password: mockUser.password,
            })

            expect(loginRes.status).toBe(200)
            const token = loginRes.body.token
            expect(token).toBeDefined()

            const region = await Region.findOne({})

            const res = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    email: 'test3@mail.com',
                    password: 'test1234',
                    region: String(region!._id),
                    name: 'tester',
                })

            expect(res.status).toBe(403)
            expect(res.body).toHaveProperty('message')
        })
    })
})
