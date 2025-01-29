import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import PaymentMethod from '../../models/PaymentMethod'

beforeAll(async () => {
    await PaymentMethod.create({
        name: 'tester',
        region: new mongoose.Types.ObjectId(),
    })
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store payment method routes', () => {
    describe('GET /store/paymentMethods', () => {
        it('should get payment methods', async () => {
            const res = await request(app).get('/api/store/paymentMethods')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })
    })

    describe('GET /store/paymentMethods/:id', () => {
        it('should get payment method by id', async () => {
            const pm = await PaymentMethod.findOne({})

            expect(pm).toBeDefined()

            const res = await request(app).get(
                `/api/store/paymentMethods/${String(pm!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('should not get non existant method', async () => {
            const res = await request(app).get(
                `/api/store/paymentMethods/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
