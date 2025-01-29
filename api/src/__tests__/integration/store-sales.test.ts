import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import Product, { PRODUCT_TYPE } from '../../models/Product'
import Sale, { SALE_TYPE } from '../../models/Sale'

const mockProducts = [
    {
        name: 'no-variant-prod',
        price: 50,
        description: 'description',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/products/test.webp',
        region: new mongoose.Types.ObjectId(),
    },
    {
        name: 'prod-with-variant',
        price: 50,
        description: 'description',
        type: PRODUCT_TYPE.PRODUCT,
        thumbnail: 'http://localhost:5000/images/products/test.webp',
        region: new mongoose.Types.ObjectId(),
        variants: [
            {
                title: 'Black/XL',
                options: [
                    { name: 'Size', value: 'XL' },
                    { name: 'Color', value: 'Black' },
                ],
                price: 444,
                quantity: 100,
            },
        ],
    },
]

beforeAll(async () => {
    // Mock products
    const prods = await Product.insertMany(mockProducts)
    await Sale.create({
        name: 'test-sale',
        products: prods,
        type: SALE_TYPE.PERCENTAGE,
        discountAmount: 0.1,
    })
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store sale routes', () => {
    describe('GET /store/sales', () => {
        it('should get all sales', async () => {
            const res = await request(app).get('/api/store/sales')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveLength(1)
        })
    })

    describe('GET /store/sales/:id', () => {
        it('should get the sale by id', async () => {
            const getAllRes = await request(app).get('/api/store/sales')
            expect(getAllRes.status).toBe(200)
            expect(getAllRes.body).toHaveProperty('data')

            const getOneRes = await request(app).get(
                `/api/store/sales/${String(getAllRes.body.data[0]._id)}`
            )

            expect(getOneRes.status).toBe(200)
            expect(getOneRes.body).toHaveProperty('data')
        })

        it('should not get non existant sale', async () => {
            const res = await request(app).get(
                `/api/store/sales/${new mongoose.Types.ObjectId()}`
            )

            expect(res.status).toBe(404)
            expect(res.body).toHaveProperty('message')
        })
    })
})
