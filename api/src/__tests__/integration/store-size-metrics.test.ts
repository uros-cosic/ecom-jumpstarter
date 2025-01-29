import request from 'supertest'
import mongoose from 'mongoose'

import { app, server } from '../../index'
import SizeMetric from '../../models/SizeMetric'

beforeAll(async () => {
    await SizeMetric.create({
        name: 'tester',
        image: 'http://localhost:5000/images/size-metric/test.webp',
    })
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store size metric routes', () => {
    describe('GET /store/sizeMetrics', () => {
        it('should get all size metrics', async () => {
            const res = await request(app).get('/api/store/sizeMetrics')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })
    })

    describe('GET /store/sizeMetrics/:id', () => {
        it('should get size metric by id', async () => {
            const sm = await SizeMetric.findOne({})

            expect(sm).toBeDefined()

            const res = await request(app).get(
                `/api/store/sizeMetrics/${String(sm!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })

        it('should not get the non existant size metric', async () => {
            const res = await request(app).get(
                `/api/store/sizeMetrics/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
