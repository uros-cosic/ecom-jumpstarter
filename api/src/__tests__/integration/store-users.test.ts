import request from 'supertest'
import mongoose from 'mongoose'

import { app, server } from '../../index'

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

beforeEach(async () => {
    // Clear collections
    const collections = (await mongoose.connection.db?.collections()) ?? []
    for (const collection of collections) {
        await collection.deleteMany({})
    }
})

describe('Store Users route', () => {
    describe('GET /users/me', () => {
        it('should get the current user', async () => {
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'tester',
                    email: 'test@mail.com',
                    password: 'test1234',
                    region: new mongoose.Types.ObjectId(),
                })
            expect(registerRes.status).toBe(201)
            expect(registerRes.body).toHaveProperty('token')

            const userRes = await request(app)
                .get('/api/store/users/me')
                .set('Authorization', `Bearer ${registerRes.body.token}`)

            expect(userRes.status).toBe(200)
            expect(userRes.body).toHaveProperty('data')
        })

        it('should not get unauthorizied user', async () => {
            const res = await request(app).get('/api/store/users/me')

            expect(res.status).toBe(401)
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('PATCH /users/me', () => {
        it('should update the current user', async () => {
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@mail.com',
                    password: 'test1234',
                    name: 'tester',
                    region: new mongoose.Types.ObjectId(),
                })
            expect(registerRes.status).toBe(201)
            expect(registerRes.body).toHaveProperty('token')

            const userRes = await request(app)
                .patch('/api/store/users/updateMe')
                .set('Authorization', `Bearer ${registerRes.body.token}`)
                .send({ name: 'tester2' })

            expect(userRes.status).toBe(200)
            expect(userRes.body).toHaveProperty('data')
            expect(userRes.body.data).toHaveProperty('name', 'tester2')
        })

        it('should not update unauthorizied user', async () => {
            const res = await request(app)
                .patch('/api/store/users/updateMe')
                .send({ name: 'tester123' })

            expect(res.status).toBe(401)
            expect(res.body).toHaveProperty('message')
        })

        it('should not update the role property', async () => {
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@mail.com',
                    password: 'test1234',
                    name: 'tester',
                    region: new mongoose.Types.ObjectId(),
                })
            expect(registerRes.status).toBe(201)
            expect(registerRes.body).toHaveProperty('token')

            const userRes = await request(app)
                .patch('/api/store/users/updateMe')
                .set('Authorization', `Bearer ${registerRes.body.token}`)
                .send({ role: 'admin' })

            expect(userRes.status).toBe(200)
            expect(userRes.body).toHaveProperty('data')
            expect(userRes.body.data).toHaveProperty('role', 'user')
        })
    })
})
