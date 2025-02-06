import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import Region from '../../models/Region'

beforeAll(async () => {
    // Mock regions
    await Region.create({
        name: 'test',
        currency: 'usd',
        countries: [new mongoose.Types.ObjectId()],
        defaultLocale: 'en',
    })
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store region routes', () => {
    describe('GET /store/regions', () => {
        it('should get all regions', async () => {
            const res = await request(app).get('/api/store/regions')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })
    })

    describe('GET /store/regions/:id', () => {
        it('should get region by id', async () => {
            const region = await Region.findOne({})

            expect(region).toBeDefined()

            const res = await request(app).get(
                `/api/store/regions/${String(region!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('should not get non existant region', async () => {
            const res = await request(app).get(
                `/api/store/regions/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
