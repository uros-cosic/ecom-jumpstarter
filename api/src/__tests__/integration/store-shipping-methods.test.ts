import request from 'supertest'
import mongoose from 'mongoose'

import { app, server } from '../../index'
import ShippingMethod from '../../models/ShippingMethod'

const mockMethods = [
    {
        name: 'test1',
        cost: 1234,
    },
    {
        name: 'test2',
        cost: 500,
    },
]

beforeAll(async () => {
    // Mock methods

    await ShippingMethod.insertMany(mockMethods)
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store shipping method routes', () => {
    describe('GET /store/shippingMethods', () => {
        it('should get all shipping methods', async () => {
            const res = await request(app).get('/api/store/shippingMethods')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveLength(mockMethods.length)
        })
    })

    describe('GET /store/shippingMethods/:id', () => {
        it('should get method by id', async () => {
            const getRes = await request(app).get(
                `/api/store/shippingMethods?name=${mockMethods[0].name}`
            )
            expect(getRes.status).toBe(200)
            expect(getRes.body).toHaveProperty('data')
            expect(getRes.body.data).toHaveLength(1)

            const res = await request(app).get(
                `/api/store/shippingMethods/${String(getRes.body.data[0]._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('shold not get non existant method', async () => {
            const res = await request(app).get(
                `/api/store/shippingMethods/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
