import request from 'supertest'
import mongoose from 'mongoose'

import { app, server } from '../../index'
import ProductCollection from '../../models/ProductCollection'

const mockProductCollections = [
    {
        name: 'tester',
        description: 'test-desc',
    },
    {
        name: 'tester2',
        description: 'test-desc',
    },
]

beforeAll(async () => {
    // Mock collections
    await ProductCollection.insertMany(mockProductCollections)
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store product collections route', () => {
    describe('GET /store/productCollections', () => {
        it('should get product collections', async () => {
            const res = await request(app).get('/api/store/productCollections')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveLength(mockProductCollections.length)
        })

        it('should get limited product collections', async () => {
            const res = await request(app).get(
                '/api/store/productCollections?limit=1'
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveLength(1)
        })
    })

    describe('GET /store/productCollections/:id', () => {
        it('should get desired product collection', async () => {
            const productCollection = await ProductCollection.findOne({
                name: mockProductCollections[0].name,
            })

            expect(productCollection).toBeDefined()

            const res = await request(app).get(
                `/api/store/productCollections/${String(productCollection!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveProperty(
                'name',
                mockProductCollections[0].name
            )
        })

        it('should not get the non existant product collection', async () => {
            const res = await request(app).get(
                `/api/store/productCollections/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
