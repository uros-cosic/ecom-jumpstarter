import { Router } from 'express'

import { protect } from '../controllers/auth-controller'
import {
    createProductReview,
    getProductReview,
    getProductReviews,
} from '../controllers/product-review-controller'

const router = Router()

router.route('/').get(getProductReviews).post(protect, createProductReview)
router.route('/:id').get(getProductReview)

export default router
