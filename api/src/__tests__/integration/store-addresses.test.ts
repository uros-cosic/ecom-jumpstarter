import request from 'supertest'
import mongoose from 'mongoose'

import { app, server } from '../../index'
import User from '../../models/User'
import Address from '../../models/Address'

const mockUser = {
    name: 'tester',
    email: 'test@mail.com',
    password: 'test1234',
    region: new mongoose.Types.ObjectId(),
}

beforeAll(async () => {
    // Mock user
    await User.create(mockUser)
})

beforeEach(async () => {
    await Address.deleteMany({})
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store addresses route', () => {
    describe('POST /store/addresses', () => {
        it('should create address', async () => {
            const res = await request(app).post('/api/store/addresses').send({
                firstName: 'tester',
                lastName: 'tester',
                address: 'test addy 123',
                city: 'test city',
                country: 'test country',
                postalCode: '12345',
                phone: '123-456',
            })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('data')
        })

        it('should not create address with missing fields', async () => {
            const res = await request(app).post('/api/store/addresses').send({
                firstName: 'test',
                lastName: 'test',
            })

            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('GET /store/addresses', () => {
        it('should get the created address', async () => {
            const createAddressRes = await request(app)
                .post('/api/store/addresses')
                .send({
                    firstName: 'tester',
                    lastName: 'tester',
                    address: 'test addy 123',
                    city: 'test city',
                    country: 'test country',
                    postalCode: '12345',
                    phone: '123-456',
                })
            expect(createAddressRes.status).toBe(201)
            expect(createAddressRes.body).toHaveProperty('data')

            const getAddressRes = await request(app).get(
                `/api/store/addresses/${String(createAddressRes.body.data._id)}`
            )

            expect(getAddressRes.status).toBe(200)
            expect(getAddressRes.body).toHaveProperty('data')
        })

        it('should not get non existant address', async () => {
            const res = await request(app).get(
                `/api/store/addresses/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('PATCH /store/addresses/:id', () => {
        it('should patch the created address', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: mockUser.email, password: mockUser.password })
            expect(loginRes.status).toBe(200)
            expect(loginRes.body).toHaveProperty('token')
            expect(loginRes.body).toHaveProperty('data')

            const createRes = await request(app)
                .post('/api/store/addresses')
                .send({
                    user: String(loginRes.body.data._id),
                    firstName: 'tester',
                    lastName: 'tester',
                    address: 'test addy 123',
                    city: 'test city',
                    country: 'test country',
                    postalCode: '12345',
                    phone: '123-456',
                })
            expect(createRes.status).toBe(201)

            const updateRes = await request(app)
                .patch(
                    `/api/store/addresses/${String(createRes.body.data._id)}`
                )
                .set('Authorization', `Bearer ${loginRes.body.token}`)
                .send({ firstName: 'tester2' })

            expect(updateRes.status).toBe(200)
            expect(updateRes.body).toHaveProperty('data')
            expect(updateRes.body.data).toHaveProperty('firstName', 'tester2')
        })

        it('should not patch the unowned address', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: mockUser.email, password: mockUser.password })
            expect(loginRes.status).toBe(200)
            expect(loginRes.body).toHaveProperty('token')
            expect(loginRes.body).toHaveProperty('data')

            const createRes = await request(app)
                .post('/api/store/addresses')
                .send({
                    user: String(loginRes.body.data._id),
                    firstName: 'tester',
                    lastName: 'tester',
                    address: 'test addy 123',
                    city: 'test city',
                    country: 'test country',
                    postalCode: '12345',
                    phone: '123-456',
                })
            expect(createRes.status).toBe(201)

            const updateRes = await request(app)
                .patch(
                    `/api/store/addresses/${String(createRes.body.data._id)}`
                )
                .set('Authorization', 'Bearer INVALID_TOKEN')
                .send({ firstName: 'tester2' })

            expect(updateRes.status).toBe(401)
            expect(updateRes.body).toHaveProperty('message')
        })
    })

    describe('DELETE /store/addresses/:id', () => {
        it('should delete created address', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: mockUser.email, password: mockUser.password })
            expect(loginRes.status).toBe(200)
            expect(loginRes.body).toHaveProperty('token')
            expect(loginRes.body).toHaveProperty('data')

            const createRes = await request(app)
                .post('/api/store/addresses')
                .send({
                    user: String(loginRes.body.data._id),
                    firstName: 'tester',
                    lastName: 'tester',
                    address: 'test addy 123',
                    city: 'test city',
                    country: 'test country',
                    postalCode: '12345',
                    phone: '123-456',
                })
            expect(createRes.status).toBe(201)

            const deleteRes = await request(app)
                .delete(
                    `/api/store/addresses/${String(createRes.body.data._id)}`
                )
                .set('Authorization', `Bearer ${loginRes.body.token}`)

            expect(deleteRes.status).toBe(204)
        })

        it('should not delete unowned address', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: mockUser.email, password: mockUser.password })
            expect(loginRes.status).toBe(200)
            expect(loginRes.body).toHaveProperty('token')
            expect(loginRes.body).toHaveProperty('data')

            const createRes = await request(app)
                .post('/api/store/addresses')
                .send({
                    user: String(loginRes.body.data._id),
                    firstName: 'tester',
                    lastName: 'tester',
                    address: 'test addy 123',
                    city: 'test city',
                    country: 'test country',
                    postalCode: '12345',
                    phone: '123-456',
                })
            expect(createRes.status).toBe(201)

            const deleteRes = await request(app)
                .delete(
                    `/api/store/addresses/${String(createRes.body.data._id)}`
                )
                .set('Authorization', `Bearer INVALID_TOKEN`)

            expect(deleteRes.status).toBe(401)
        })
    })
})
