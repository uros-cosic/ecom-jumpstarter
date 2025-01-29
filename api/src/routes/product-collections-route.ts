import { Router } from 'express'

import {
    getProductCollection,
    getProductCollections,
} from '../controllers/product-collection-controller'

const router = Router()

router.route('/').get(getProductCollections)
router.route('/:id').get(getProductCollection)

export default router
