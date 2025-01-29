import { Router } from 'express'

import { getBlogPost, getBlogPosts } from '../controllers/blog-post-controller'

const router = Router()

router.route('/').get(getBlogPosts)
router.route('/:id').get(getBlogPost)

export default router
