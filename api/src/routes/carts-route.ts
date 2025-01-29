import { Router } from 'express'

import { createCart, getCart, updateCart } from '../controllers/cart-controller'

const router = Router()

router.route('/').post(createCart)
router.route('/:id').get(getCart).patch(updateCart)

export default router
