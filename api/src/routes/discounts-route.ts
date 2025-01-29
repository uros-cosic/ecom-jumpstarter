import { Router } from 'express'

import { getDiscount } from '../controllers/discount-controller'

const router = Router()

router.route('/:id').get(getDiscount)

export default router
