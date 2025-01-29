import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import Cart from '../../models/Cart'
import Product, { PRODUCT_TYPE } from '../../models/Product'
import PaymentMethod from '../../models/PaymentMethod'
import User from '../../models/User'

const mockProducts = [
    {
        name: 'no-variant-prod',
        price: 50,
        description: 'description',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/products/test.webp',
        region: new mongoose.Types.ObjectId(),
    },
    {
        name: 'no-variant-prod2',
        price: 1500,
        description: 'description',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/products/test.webp',
        region: new mongoose.Types.ObjectId(),
    },
]

beforeAll(async () => {
    const user = await User.create({
        name: 'test',
        email: 'test@mail.com',
        password: 'test1234',
        region: new mongoose.Types.ObjectId(),
    })
    const prods = await Product.insertMany(mockProducts)
    const paymentMethod = await PaymentMethod.create({
        name: 'manual',
        region: new mongoose.Types.ObjectId(),
    })
    await Cart.create({
        customer: user,
        items: prods.map((p) => ({ product: String(p._id) })),
        region: new mongoose.Types.ObjectId(),
        address: new mongoose.Types.ObjectId(),
        email: 'test@mail.com',
        shippingMethod: new mongoose.Types.ObjectId(),
        paymentMethod,
    })
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store order routes', () => {
    describe('GET /store/orders/:id', () => {
        it('should get created order by id', async () => {
            const cart = await Cart.findOne({})
            expect(cart).toBeDefined()

            const createRes = await request(app)
                .post('/api/store/orders')
                .send({ cart })
            expect(createRes.status).toBe(201)
            expect(createRes.body).toHaveProperty('data')

            const res = await request(app).get(
                `/api/store/orders/${String(createRes.body.data._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })
    })

    describe('GET /store/orders/latest', () => {
        it('should get latest orders', async () => {
            const cart = await Cart.findOne({})
            expect(cart).toBeDefined()

            const createRes = await request(app)
                .post('/api/store/orders')
                .send({ cart })
            expect(createRes.status).toBe(201)
            expect(createRes.body).toHaveProperty('data')

            const loginRes = await request(app).post('/api/auth/login').send({
                email: 'test@mail.com',
                password: 'test1234',
            })
            expect(loginRes.status).toBe(200)
            expect(loginRes.body).toHaveProperty('data')

            const res = await request(app)
                .get(`/api/store/orders/latest`)
                .set('Authorization', `Bearer ${loginRes.body.token}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('should not get latest orders without auth', async () => {
            const res = await request(app).get(`/api/store/orders/latest`)

            expect(res.status).toBe(401)
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('POST /store/orders', () => {
        it('should create order', async () => {
            const cart = await Cart.findOne({})

            expect(cart).toBeDefined()

            const res = await request(app)
                .post('/api/store/orders')
                .send({ cart })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('data')
        })
    })
})
