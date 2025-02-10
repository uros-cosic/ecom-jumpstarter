import { Router } from 'express'

import {
    getDiscount,
    getDiscountByCode,
} from '../controllers/discount-controller'

const router = Router()

router.route('/code').get(getDiscountByCode)
router.route('/:id').get(getDiscount)

export default router
