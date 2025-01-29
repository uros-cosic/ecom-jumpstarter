import request from 'supertest'
import mongoose from 'mongoose'

import { app, server } from '../../index'
import Product, { IProduct, PRODUCT_TYPE } from '../../models/Product'

const products = [
    {
        name: 'tester1',
        price: 50,
        description: 'description',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/products/test.webp',
        region: new mongoose.Types.ObjectId(),
    },
    {
        name: 'tester2',
        price: 100,
        description: 'description',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/products/test.webp',
        region: new mongoose.Types.ObjectId(),
    },
]

beforeAll(async () => {
    // Mock products
    await Product.insertMany(products)
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store products route', () => {
    describe('GET /store/products', () => {
        it('should get all products', async () => {
            const res = await request(app).get('/api/store/products')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveLength(products.length)
        })

        it('should only get tester2 product', async () => {
            const res = await request(app).get(
                '/api/store/products?handle=tester2'
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveLength(1)
            expect(res.body.data[0]).toHaveProperty('name', 'tester2')
        })
    })

    describe('GET /store/products/:id', () => {
        it('should get the tester1 product', async () => {
            const productsRes = await request(app).get('/api/store/products')
            expect(productsRes.status).toBe(200)
            expect(productsRes.body).toHaveProperty('data')
            expect(productsRes.body.data).toHaveLength(products.length)

            const tester1Id = productsRes.body.data.filter(
                (i: IProduct) => i.name === 'tester1'
            )[0]

            expect(tester1Id).toBeDefined()

            const productRes = await request(app).get(
                `/api/store/products/${String(tester1Id._id)}`
            )

            expect(productRes.status).toBe(200)
            expect(productRes.body).toHaveProperty('data')
        })
    })

    it('should not get non existant product', async () => {
        const res = await request(app).get(
            `/api/store/products/${new mongoose.Types.ObjectId()}`
        )

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message')
    })
})
