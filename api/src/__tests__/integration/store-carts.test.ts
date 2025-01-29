import request from 'supertest'
import mongoose from 'mongoose'

import { server, app } from '../../index'
import Product, { PRODUCT_TYPE } from '../../models/Product'

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
    await Product.insertMany(mockProducts)
})

afterAll(async () => {
    // Clear the db and close connections
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store cart routes', () => {
    describe('GET /store/cart/:id', () => {
        it('should get the created cart by id', async () => {
            const createRes = await request(app).post('/api/store/carts').send({
                region: new mongoose.Types.ObjectId(),
            })
            expect(createRes.status).toBe(201)
            expect(createRes.body).toHaveProperty('data')

            const getRes = await request(app).get(
                `/api/store/carts/${String(createRes.body.data._id)}`
            )

            expect(getRes.status).toBe(200)
            expect(getRes.body).toHaveProperty('data')
        })
    })

    describe('POST /store/cart', () => {
        it('should create empty cart', async () => {
            const res = await request(app).post('/api/store/carts').send({
                region: new mongoose.Types.ObjectId(),
            })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('data')
        })

        it('should create cart with products', async () => {
            const nonVariantProd = await Product.findOne({
                name: mockProducts[0].name,
            })
            const variantProd = await Product.findOne({
                name: mockProducts[1].name,
            })
            expect(nonVariantProd).toBeDefined()
            expect(variantProd).toBeDefined()

            const res = await request(app)
                .post('/api/store/carts')
                .send({
                    region: new mongoose.Types.ObjectId(),
                    items: [
                        {
                            product: nonVariantProd,
                            quantity: 2,
                        },
                        {
                            product: variantProd,
                            variant: variantProd!.variants[0]._id,
                            quantity: 3,
                        },
                    ],
                })

            const totalPrice =
                2 * nonVariantProd!.price + 3 * variantProd!.variants[0].price

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('data')
            expect(res.body.data).toHaveProperty('items')
            expect(res.body.data).toHaveProperty('totalPrice')
            expect(res.body.data.totalPrice).toBe(totalPrice)
        })
    })

    describe('PATCH /store/carts', () => {
        it('should update the cart', async () => {
            const createRes = await request(app).post('/api/store/carts').send({
                region: new mongoose.Types.ObjectId(),
            })
            expect(createRes.status).toBe(201)

            const nonVariantProd = await Product.findOne({
                name: mockProducts[0].name,
            })
            expect(nonVariantProd).toBeDefined()

            const updateRes = await request(app)
                .patch(`/api/store/carts/${String(createRes.body.data._id)}`)
                .send({ items: [{ product: nonVariantProd, quantity: 10 }] })

            expect(updateRes.status).toBe(200)
            expect(updateRes.body).toHaveProperty('data')
            expect(updateRes.body.data.items).toHaveLength(1)
            expect(updateRes.body.data.totalPrice).toBe(
                10 * mockProducts[0].price
            )
        })

        it('should not be able to update totalPrice prop', async () => {
            const createRes = await request(app).post('/api/store/carts').send({
                region: new mongoose.Types.ObjectId(),
            })
            expect(createRes.status).toBe(201)

            const updateRes = await request(app)
                .patch(`/api/store/carts/${String(createRes.body.data._id)}`)
                .send({ totalPrice: 1234 })

            expect(updateRes.status).toBe(200)
            expect(updateRes.body).toHaveProperty('data')
            expect(updateRes.body.data.totalPrice).toBe(0)
        })
    })
})
