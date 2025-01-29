import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import User from '../../models/User'
import Cart from '../../models/Cart'
import Product, { PRODUCT_TYPE } from '../../models/Product'
import PaymentMethod from '../../models/PaymentMethod'
import Order from '../../models/Order'
import ProductReview from '../../models/ProductReview'

const products = [
    {
        name: 'tester1',
        price: 50,
        description: 'description',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/products/test.webp',
        region: new mongoose.Types.ObjectId(),
    },
    {
        name: 'tester2',
        price: 100,
        description: 'description',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/products/test.webp',
        region: new mongoose.Types.ObjectId(),
    },
]

beforeAll(async () => {
    const user = await User.create({
        name: 'tester',
        email: 'test@mail.com',
        password: 'test1234',
        region: new mongoose.Types.ObjectId(),
    })

    const prods = await Product.insertMany(products)

    const paymentMethod = await PaymentMethod.create({
        name: 'manual',
        region: new mongoose.Types.ObjectId(),
    })

    const cart = await Cart.create({
        customer: user,
        items: prods.map((p) => ({ product: String(p._id) })),
        paymentMethod,
        address: new mongoose.Types.ObjectId(),
        region: new mongoose.Types.ObjectId(),
        shippingMethod: new mongoose.Types.ObjectId(),
        email: 'test@mail.com',
    })

    const order = await Order.create({
        customer: user,
        cart,
    })

    await ProductReview.create({
        customer: user,
        product: String(prods[0]._id),
        rating: 5,
        comment: 'test comment',
        region: new mongoose.Types.ObjectId(),
        order: String(order._id),
    })
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store product review routes', () => {
    describe('GET /store/productReviews', () => {
        it('should get all reviews', async () => {
            const res = await request(app).get('/api/store/productReviews')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })
    })

    describe('GET /store/productReviews/:id', () => {
        it('should get product review by id', async () => {
            const getRes = await request(app).get(
                '/api/store/productReviews?limit=1'
            )
            expect(getRes.status).toBe(200)
            expect(getRes.body).toHaveProperty('data')

            const res = await request(app).get(
                `/api/store/productReviews/${String(getRes.body.data[0]._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('should not get non existant review', async () => {
            const res = await request(app).get(
                `/api/store/productReviews/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('POST /store/productReviews', () => {
        it('should create a review', async () => {
            const loginRes = await request(app).post('/api/auth/login').send({
                email: 'test@mail.com',
                password: 'test1234',
            })
            expect(loginRes.status).toBe(200)
            expect(loginRes.body).toHaveProperty('token')

            const prod = await Product.findOne({ name: 'tester2' })
            const order = await Order.findOne({})

            const res = await request(app)
                .post('/api/store/productReviews')
                .set('Authorization', `Bearer ${loginRes.body.token}`)
                .send({
                    product: String(prod!._id),
                    rating: 4,
                    region: new mongoose.Types.ObjectId(),
                    order: String(order!._id),
                })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('data')
        })

        it('should not allow multiple reviews for the same order and product', async () => {
            const review = await ProductReview.findOne({})
            expect(review).toBeDefined()

            const loginRes = await request(app).post('/api/auth/login').send({
                email: 'test@mail.com',
                password: 'test1234',
            })
            expect(loginRes.status).toBe(200)
            expect(loginRes.body).toHaveProperty('token')

            const res = await request(app)
                .post('/api/store/productReviews')
                .set('Authorization', `Bearer ${loginRes.body.token}`)
                .send({
                    product: review!.product,
                    order: review!.order,
                    rating: 1,
                    region: new mongoose.Types.ObjectId(),
                })

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message')
        })

        it('should not allow order creation if unauthenticated', async () => {
            const res = await request(app)
                .post('/api/store/productReviews')
                .set('Authorization', 'Bearer INVALID_TOKEN')
                .send({
                    product: new mongoose.Types.ObjectId(),
                    order: new mongoose.Types.ObjectId(),
                    rating: 1,
                    region: new mongoose.Types.ObjectId(),
                })

            expect(res.status).toBe(401)
            expect(res.body).toHaveProperty('message')
        })
    })
})
