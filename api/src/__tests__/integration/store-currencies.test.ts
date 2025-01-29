import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import Currency from '../../models/Currency'

beforeAll(async () => {
    // Mock currencies
    await Currency.create({
        name: 'test',
        code: 'code',
        symbol: '$',
    })
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store currency routes', () => {
    describe('GET /store/currencies', () => {
        it('should get all currencies', async () => {
            const res = await request(app).get('/api/store/currencies')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })
    })

    describe('GET /store/currencies/:id', () => {
        it('should get currency by id', async () => {
            const currency = await Currency.findOne({})

            expect(currency).toBeDefined()

            const res = await request(app).get(
                `/api/store/currencies/${String(currency!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('should not get non existant currency', async () => {
            const res = await request(app).get(
                `/api/store/currencies/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
