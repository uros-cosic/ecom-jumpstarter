import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import Discount, { DISCOUNT_TYPE } from '../../models/Discount'

beforeAll(async () => {
    // Mock discount
    await Discount.create({
        code: 'test123',
        type: DISCOUNT_TYPE.PERCENTAGE,
        amount: 0.1,
    })
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store discount routes', () => {
    describe('GET /store/discounts/:id', () => {
        it('should get discount by id', async () => {
            const discount = await Discount.findOne({})

            expect(discount).toBeDefined()

            const res = await request(app).get(
                `/api/store/discounts/${String(discount!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('should not get non existant discount', async () => {
            const res = await request(app).get(
                `/api/store/discounts/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
