import { Router } from 'express'

import {
    getProductCategories,
    getProductCategory,
} from '../controllers/product-category-controller'

const router = Router()

router.route('/').get(getProductCategories)
router.route('/:id').get(getProductCategory)

export default router
