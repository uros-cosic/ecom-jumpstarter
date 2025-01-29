import { Router } from 'express'

import {
    getPaymentMethod,
    getPaymentMethods,
} from '../controllers/payment-method-controller'

const router = Router()

router.route('/').get(getPaymentMethods)
router.route('/:id').get(getPaymentMethod)

export default router
