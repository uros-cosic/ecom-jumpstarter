import request from 'supertest'
import mongoose from 'mongoose'

import { app, server } from '../../index'
import BlogPost from '../../models/BlogPost'

beforeAll(async () => {
    await BlogPost.create({
        title: 'testpost',
        description: 'testdescr',
        content: '<h1>Hello World</h1>',
        thumbnail: 'http://localhost:5000/images/blog/test.webp',
    })
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
})

describe('Store blog post routes', () => {
    describe('GET /store/blogs', () => {
        it('should get all posts', async () => {
            const res = await request(app).get('/api/store/blogs')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })
    })

    describe('GET /store/blogs/:id', () => {
        it('should get post by id', async () => {
            const post = await BlogPost.findOne({})
            expect(post).toBeDefined()

            const res = await request(app).get(
                `/api/store/blogs/${String(post!._id)}`
            )

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('data')
        })
    })
})
