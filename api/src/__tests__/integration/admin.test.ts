import mongoose from 'mongoose'
import request from 'supertest'

import { server, app } from '../../index'
import User, { USER_ROLE } from '../../models/User'
import Country from '../../models/Country'
import Region from '../../models/Region'
import PaymentMethod from '../../models/PaymentMethod'
import Order, {
    AUTOMATED_PAYMENT_METHODS,
    ORDER_STATUS,
} from '../../models/Order'
import ShippingMethod from '../../models/ShippingMethod'
import Product, { PRODUCT_TYPE } from '../../models/Product'
import Cart from '../../models/Cart'
import Address from '../../models/Address'
import ProductReview from '../../models/ProductReview'
import ProductCategory from '../../models/ProductCategory'
import ProductCollection from '../../models/ProductCollection'
import SizeMetric from '../../models/SizeMetric'

const adminCredentials = { email: 'admin@test.com', password: 'admin123' }

const mockAdminUser = {
    role: USER_ROLE.ADMIN,
    email: adminCredentials.email,
    name: 'tester',
    password: adminCredentials.password,
}

const mockUser = {
    email: 'test@mail.com',
    name: 'tester',
    password: 'test1234',
}

let adminToken: string

beforeAll(async () => {
    const country = await Country.create({
        name: 'test-country',
        code: 'us',
        currency: 'usd',
        languages: ['en'],
    })
    const region = await Region.create({
        name: 'test-region',
        currency: 'usd',
        countries: [String(country._id)],
        defaultLocale: 'en',
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
        region: String(region._id),
    })

    await ProductCollection.create({
        name: 'test-coll',
        description: 'test-desc',
        region: String(region._id),
    })

    await SizeMetric.create({
        name: 'test123',
        image: 'http://localhost:5000/images/size-metric/test.webp',
    })

    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(adminCredentials)
    adminToken = loginResponse.body.token
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Admin Routes', () => {
    describe('GET /admin/users', () => {
        it('Should fetch all users', async () => {
            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('POST /admin/users', () => {
        it('Should create a new user', async () => {
            const region = await Region.findOne({})

            const res = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    email: 'newuser@test.com',
                    password: 'password123',
                    name: 'tester123',
                    region: String(region!._id),
                })
            expect(res.status).toBe(201)
        })
    })

    describe('GET /admin/users/:id', () => {
        it('Should fetch a user by ID', async () => {
            const user = await User.findOne({})

            const res = await request(app)
                .get(`/api/admin/users/${user!._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('PATCH /admin/users/:id', () => {
        it('Should update a user', async () => {
            const user = await User.findOne({})

            const res = await request(app)
                .patch(`/api/admin/users/${user!._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ role: USER_ROLE.ADMIN })
            expect(res.status).toBe(200)
            expect(res.body.data.role).toBe(USER_ROLE.ADMIN)
        })
    })

    describe('DELETE /admin/users/:id', () => {
        it('Should delete a user', async () => {
            const user = await User.findOne({})

            const res = await request(app)
                .delete(`/api/admin/users/${user!._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(204)
        })
    })

    describe('GET /admin/orders/:id', () => {
        it('Should fetch a specific order', async () => {
            const order = await Order.findOne({})

            const res = await request(app)
                .get(`/api/admin/orders/${order!._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('PATCH /admin/orders/:id', () => {
        it('Should update an order', async () => {
            const order = await Order.findOne({})

            const res = await request(app)
                .patch(`/api/admin/orders/${order!._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: ORDER_STATUS.CANCELED })
            expect(res.status).toBe(200)
            expect(res.body.data.status).toBe(ORDER_STATUS.CANCELED)
        })
    })

    describe('GET /admin/analytics/site', () => {
        it('Should fetch site analytics', async () => {
            const res = await request(app)
                .get('/api/admin/analytics/site')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('GET /admin/analytics/orders', () => {
        it('Should fetch order analytics', async () => {
            const res = await request(app)
                .get('/api/admin/analytics/orders')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('POST /admin/regions', () => {
        it('Should create a new region', async () => {
            const country = await Country.findOne({})

            const res = await request(app)
                .post('/api/admin/regions')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'test-region2',
                    currency: 'usd',
                    countries: [String(country!._id)],
                    defaultLocale: 'en',
                })
            expect(res.status).toBe(201)
        })
    })

    describe('DELETE /admin/regions/:id', () => {
        it('Should delete a region', async () => {
            const region = await Region.findOne({ name: 'test-region2' })

            const res = await request(app)
                .delete(`/api/admin/regions/${region!._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(204)
        })
    })

    describe('GET /admin/shippingMethods', () => {
        it('Should fetch all shipping methods', async () => {
            const res = await request(app)
                .get('/api/admin/shippingMethods')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('GET /admin/newsletters', () => {
        it('Should fetch all newsletters', async () => {
            const res = await request(app)
                .get('/api/admin/newsletters')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('GET /admin/productReviews', () => {
        it('Should fetch all product reviews', async () => {
            const res = await request(app)
                .get('/api/admin/productReviews')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('POST /admin/sizeMetrics', () => {
        it('Should create a size metric', async () => {
            const res = await request(app)
                .post('/api/admin/sizeMetrics')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Size Metric',
                    image: 'http://localhost:5000/images/size-metric/test.webp',
                })
            expect(res.status).toBe(201)
        })
    })

    describe('DELETE /admin/sizeMetrics/:id', () => {
        it('Should delete a size metric', async () => {
            const sizeMetric = await SizeMetric.findOne({})
            const res = await request(app)
                .delete(`/api/admin/sizeMetrics/${sizeMetric!._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(204)
        })
    })

    describe('GET /admin/orders', () => {
        it('Should fetch all orders', async () => {
            const res = await request(app)
                .get('/api/admin/orders')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('GET /admin/products', () => {
        it('Should fetch all products', async () => {
            const res = await request(app)
                .get('/api/admin/products')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('POST /admin/products', () => {
        it('Should create a new product', async () => {
            const region = await Region.findOne({})

            const res = await request(app)
                .post('/api/admin/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'test-prod-123',
                    description: 'test-descr',
                    type: PRODUCT_TYPE.PRODUCT,
                    thumbnail: 'http://localhost:5000/images/product/test.webp',
                    images: ['http://localhost:5000/images/product/test.webp'],
                    region: String(region!._id),
                    price: 500,
                })
            expect(res.status).toBe(201)
        })
    })

    describe('DELETE /admin/products/:id', () => {
        it('Should delete a product', async () => {
            const region = await Region.findOne({})

            const product = await Product.create({
                name: 'test-prod-1234',
                description: 'test-descr',
                type: PRODUCT_TYPE.PRODUCT,
                thumbnail: 'http://localhost:5000/images/product/test.webp',
                images: ['http://localhost:5000/images/product/test.webp'],
                region: String(region!._id),
                price: 500,
            })

            const res = await request(app)
                .delete(`/api/admin/products/${product._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(204)
        })
    })

    describe('GET /admin/blogs', () => {
        it('Should fetch all blogs', async () => {
            const res = await request(app)
                .get('/api/admin/blogs')
                .set('Authorization', `Bearer ${adminToken}`)
            expect(res.status).toBe(200)
        })
    })

    describe('Middleware Enforcement', () => {
        it('Should return 401 for unauthorized access', async () => {
            const res = await request(app).get('/api/admin/users')
            expect(res.status).toBe(401)
        })
    })
})
