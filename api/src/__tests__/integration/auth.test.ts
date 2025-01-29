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

describe('Auth routes', () => {
    describe('POST /auth/register', () => {
        it('should register user successfully', async () => {
            const res = await request(app).post('/api/auth/register').send({
                email: 'test@mail.com',
                password: 'test1234',
                name: 'tester',
                region: new mongoose.Types.ObjectId(),
            })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('data')
            expect(res.body).toHaveProperty('token')
            expect(res.body).toHaveProperty('refreshToken')
        })

        it('should not register user because of missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test2@mail.com', password: 'qwerty1234' })

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message')
        })

        it('should not register user because of invalid fields', async () => {
            const res = await request(app).post('/api/auth/register').send({
                email: 'test3@mail.com',
                password: '123',
                name: 'tester',
                region: new mongoose.Types.ObjectId(),
            })

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('POST /auth/login', () => {
        it('should login the registered user', async () => {
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'tester',
                    email: 'test@mail.com',
                    password: 'test1234',
                    region: new mongoose.Types.ObjectId(),
                })
            expect(registerRes.status).toBe(201)

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@mail.com', password: 'test1234' })

            expect(loginRes.status).toBe(200)
            expect(loginRes.body).toHaveProperty('token')
            expect(loginRes.body).toHaveProperty('refreshToken')
            expect(loginRes.body).toHaveProperty('data')
        })

        it('should not login with incorrect credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'zzz@mail.com', password: 'zzzzzzzz' })

            expect(res.status).toBe(401)
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('POST /auth/logOut', () => {
        it('should log out the user', async () => {
            const res = await request(app).post('/api/auth/logOut')

            expect(res.status).toBe(200)
        })
    })

    describe('PATCH /auth/changePassword', () => {
        it('should change the current user password', async () => {
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

            const changePwRes = await request(app)
                .patch('/api/auth/changePassword')
                .set('Authorization', `Bearer ${registerRes.body.token}`)
                .send({ passwordCurrent: 'test1234', password: 'test12345' })

            expect(changePwRes.status).toBe(200)
            expect(changePwRes.body).toHaveProperty('token')
            expect(changePwRes.body).toHaveProperty('refreshToken')
            expect(changePwRes.body).toHaveProperty('data')
        })

        it('should not change the password because of missing fields', async () => {
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

            const changePwRes = await request(app)
                .patch('/api/auth/changePassword')
                .set('Authorization', `Bearer ${registerRes.body.token}`)
                .send({ password: 'new-password-123' })

            expect(changePwRes.status).toBe(400)
        })

        it('should not allow password change for non authenticated user', async () => {
            const res = await request(app)
                .patch('/api/auth/changePassword')
                .send({ password: 'test1234', passwordCurrent: 'test1234' })

            expect(res.status).toBe(401)
        })
    })
})
