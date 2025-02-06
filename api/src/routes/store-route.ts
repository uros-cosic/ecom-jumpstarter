import { Router } from 'express'

import usersRoute from './users-route'
import productsRoute from './products-route'
import addressesRoute from './addresses-route'
import productCategoriesRoute from './product-categories-route'
import productCollectionsRoute from './product-collections-route'
import cartsRoute from './carts-route'
import salesRoute from './sales-route'
import discountsRoute from './discounts-route'
import shippingMethodsRoute from './shipping-methods-route'
import countriesRoute from './countries-route'
import regionsRoute from './regions-route'
import sizeMetricsRoute from './size-metrics-route'
import ordersRoute from './orders-route'
import paymentMethodsRoute from './payment-methods-route'
import productReviewsRoute from './product-reviews-route'
import paymentsRoute from './payments-route'
import newslettersRoute from './newsletters-route'
import blogPostsRoute from './blog-posts-route'
import { trackUser } from '../controllers/user-controller'

const router = Router()

// Tracking
router.use(trackUser)

router.use('/products', productsRoute)
router.use('/users', usersRoute)
router.use('/addresses', addressesRoute)
router.use('/productCategories', productCategoriesRoute)
router.use('/productCollections', productCollectionsRoute)
router.use('/carts', cartsRoute)
router.use('/sales', salesRoute)
router.use('/discounts', discountsRoute)
router.use('/shippingMethods', shippingMethodsRoute)
router.use('/countries', countriesRoute)
router.use('/regions', regionsRoute)
router.use('/sizeMetrics', sizeMetricsRoute)
router.use('/orders', ordersRoute)
router.use('/paymentMethods', paymentMethodsRoute)
router.use('/productReviews', productReviewsRoute)
router.use('/payments', paymentsRoute)
router.use('/newsletters', newslettersRoute)
router.use('/blogs', blogPostsRoute)

export default router
