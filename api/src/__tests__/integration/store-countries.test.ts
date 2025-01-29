import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import Country from '../../models/Country'

beforeAll(async () => {
    // Mock countries
    await Country.create({
        name: 'test',
        iso_2: 'te',
        region: new mongoose.Types.ObjectId(),
    })
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store country routes', () => {
    describe('GET /store/countries', () => {
        it('should get all the countries', async () => {
            const res = await request(app).get('/api/store/countries')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })
    })

    describe('GET /store/countries/:id', () => {
        it('should get country by id', async () => {
            const country = await Country.findOne({})

            expect(country).toBeDefined()

            const res = await request(app).get(
                `/api/store/countries/${String(country!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('should not get non existant country', async () => {
            const res = await request(app).get(
                `/api/store/countries/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
