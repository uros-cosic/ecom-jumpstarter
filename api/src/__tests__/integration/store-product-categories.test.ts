import request from 'supertest'
import mongoose, { Types } from 'mongoose'

import { app, server } from '../../index'
import ProductCategory from '../../models/ProductCategory'

const mockProductCategories = [
    {
        name: 'tester',
        description: 'test-desc',
        region: new Types.ObjectId(),
    },
    {
        name: 'tester2',
        description: 'test-desc',
        region: new Types.ObjectId(),
    },
]

beforeAll(async () => {
    // Mock categories
    await ProductCategory.insertMany(mockProductCategories)
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store product categories route', () => {
    describe('GET /store/productCategories', () => {
        it('should get product categories', async () => {
            const res = await request(app).get('/api/store/productCategories')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveLength(mockProductCategories.length)
        })

        it('should get limited product categories', async () => {
            const res = await request(app).get(
                '/api/store/productCategories?limit=1'
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveLength(1)
        })
    })

    describe('GET /store/productCategories/:id', () => {
        it('should get desired product category', async () => {
            const productCategory = await ProductCategory.findOne({
                name: mockProductCategories[0].name,
            })

            expect(productCategory).toBeDefined()

            const res = await request(app).get(
                `/api/store/productCategories/${String(productCategory!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveProperty(
                'name',
                mockProductCategories[0].name
            )
        })

        it('should not get the non existant product category', async () => {
            const res = await request(app).get(
                `/api/store/productCategories/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
