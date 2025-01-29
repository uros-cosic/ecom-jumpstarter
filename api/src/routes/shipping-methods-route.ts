import { Router } from 'express'

import {
    getShippingMethod,
    getShippingMethods,
} from '../controllers/shipping-method-controller'

const router = Router()

router.route('/').get(getShippingMethods)
router.route('/:id').get(getShippingMethod)

export default router
