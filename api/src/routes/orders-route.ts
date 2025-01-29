import { Router } from 'express'

import {
    createOrder,
    getMyLatestOrders,
    getOrder,
} from '../controllers/order-controller'
import { protect } from '../controllers/auth-controller'

const router = Router()

router.route('/').post(createOrder)
router.route('/latest').get(protect, getMyLatestOrders)
router.route('/:id').get(getOrder)

export default router
