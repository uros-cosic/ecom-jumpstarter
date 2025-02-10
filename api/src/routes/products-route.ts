import { Router } from 'express'

import {
    getProducts,
    getProduct,
    searchProducts,
    getProductsOnSale,
    getProductPrice,
} from '../controllers/product-controller'

const router = Router()

router.route('/').get(getProducts)
router.route('/search').get(searchProducts)
router.route('/sale').get(getProductsOnSale)
router.route('/price/:id').get(getProductPrice)
router.route('/:id').get(getProduct)

export default router
