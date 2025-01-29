import request from 'supertest'
import mongoose from 'mongoose'

import { app, server } from '../../index'
import Payment, { PAYMENT_STATUS } from '../../models/Payment'
import Product, { PRODUCT_TYPE } from '../../models/Product'
import User from '../../models/User'
import PaymentMethod from '../../models/PaymentMethod'
import Cart from '../../models/Cart'
import Order from '../../models/Order'

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
        paymentMethod: String(paymentMethod._id),
        address: new mongoose.Types.ObjectId(),
        region: new mongoose.Types.ObjectId(),
        shippingMethod: new mongoose.Types.ObjectId(),
        email: 'test@mail.com',
    })

    const order = await Order.create({
        customer: user,
        cart,
    })

    await Payment.create({
        order: String(order._id),
        method: String(paymentMethod._id),
        status: PAYMENT_STATUS.COMPLETED,
        amount: cart.totalPrice,
    })
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store payment routes', () => {
    describe('GET /store/payment/:id', () => {
        it('should get payment by id', async () => {
            const payment = await Payment.findOne({})
            expect(payment).toBeDefined()

            const res = await request(app).get(
                `/api/store/payments/${String(payment!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('should not get non existant payment', async () => {
            const res = await request(app).get(
                `/api/store/payment/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
