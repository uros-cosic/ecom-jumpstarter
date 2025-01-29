import { Router } from 'express'

import { getCurrencies, getCurrency } from '../controllers/currency-controller'

const router = Router()

router.route('/').get(getCurrencies)
router.route('/:id').get(getCurrency)

export default router
