import { Router } from 'express'

import { getSale, getSales } from '../controllers/sale-controller'

const router = Router()

router.route('/').get(getSales)
router.route('/:id').get(getSale)

export default router
