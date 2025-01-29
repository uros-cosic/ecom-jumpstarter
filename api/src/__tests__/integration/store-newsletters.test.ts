import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import Newsletter from '../../models/Newsletter'

beforeAll(async () => {
    await Newsletter.create({
        region: new mongoose.Types.ObjectId(),
        email: 'test@mail.com',
    })
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store newsletter routes', () => {
    describe('POST /store/newsletters', () => {
        it('should subscribe to newsletter', async () => {
            const res = await request(app).post('/api/store/newsletters').send({
                region: new mongoose.Types.ObjectId(),
                email: 'test123@mail.com',
            })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('data')
        })
    })

    describe('DELETE /store/newsletters/unsubscribe', () => {
        it('should unsub from newsletter', async () => {
            const res = await request(app)
                .delete('/api/store/newsletters/unsubscribe')
                .send({ email: 'test@mail.com' })

            expect(res.status).toBe(204)
        })
    })
})
