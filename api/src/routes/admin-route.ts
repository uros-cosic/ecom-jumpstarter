import { Router } from 'express'

import { protect, restrictTo } from '../controllers/auth-controller'
import { USER_ROLE } from '../models/User'
import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from '../controllers/user-controller'
import {
    getOrder,
    getOrders,
    updateOrder,
} from '../controllers/order-controller'
import {
    getOrderAnalytic,
    getOrderAnalytics,
    getSiteAnalytic,
    getSiteAnalytics,
} from '../controllers/analytics-controller'
import upload, { uploadImage } from '../controllers/upload-controller'
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
    uploadProductImages,
    uploadProductThumbnail,
} from '../controllers/product-controller'
import {
    createSale,
    deleteSale,
    getSale,
    getSales,
    updateSale,
    uploadSaleThumbnail,
} from '../controllers/sale-controller'
import {
    createBlogPost,
    deleteBlogPost,
    getBlogPost,
    getBlogPosts,
    updateBlogPost,
    uploadBlogPostThumbnail,
} from '../controllers/blog-post-controller'
import {
    createSizeMetric,
    deleteSizeMetric,
    getSizeMetric,
    getSizeMetrics,
    updateSizeMetric,
    uploadSizeMetricImage,
} from '../controllers/size-metric-controller'
import {
    createRegion,
    deleteRegion,
    getRegion,
    getRegions,
    updateRegion,
} from '../controllers/region-controller'
import {
    createProductCategory,
    deleteProductCategory,
    getProductCategories,
    getProductCategory,
    updateProductCategory,
} from '../controllers/product-category-controller'
import {
    createProductCollection,
    deleteProductCollection,
    getProductCollection,
    getProductCollections,
    updateProductCollection,
} from '../controllers/product-collection-controller'
import {
    createPaymentMethod,
    deletePaymentMethod,
    getPaymentMethod,
    getPaymentMethods,
    updatePaymentMethod,
} from '../controllers/payment-method-controller'
import {
    createDiscount,
    deleteDiscount,
    getDiscount,
    getDiscounts,
    updateDiscount,
} from '../controllers/discount-controller'
import {
    createShippingMethod,
    deleteShippingMethod,
    getShippingMethod,
    getShippingMethods,
    updateShippingMethod,
} from '../controllers/shipping-method-controller'
import {
    getNewsletter,
    getNewsletters,
    updateNewsletter,
} from '../controllers/newsletter-controller'
import {
    deleteProductReview,
    getProductReviews,
    updateProductReview,
} from '../controllers/product-review-controller'
import { getCountries, getCountry } from '../controllers/country-controller'
import { getCurrencies, getCurrency } from '../controllers/currency-controller'

const router = Router()

router.use(protect, restrictTo(USER_ROLE.ADMIN))

// Users
router.route('/users').get(getUsers).post(createUser)
router.route('/users/:id').get(getUser).patch(updateUser).delete(deleteUser)

// Orders
router.route('/orders').get(getOrders)
router.route('/orders/:id').get(getOrder).patch(updateOrder)

// Analytics (store, order)
router.route('/analytics/site').get(getSiteAnalytics)
router.route('/analytics/site/:id').get(getSiteAnalytic)
router.route('/analytics/orders').get(getOrderAnalytics)
router.route('/analytics/orders/:id').get(getOrderAnalytic)

// Uploads
router.route('/uploads/image').post(upload.single('image'), uploadImage)
router
    .route('/uploads/products/thumbnail')
    .post(upload.single('thumbnail'), uploadProductThumbnail)
router
    .route('/uploads/products/images')
    .post(upload.array('images', 8), uploadProductImages)
router
    .route('/uploads/sales/thumbnail')
    .post(upload.single('thumbnail'), uploadSaleThumbnail)
router
    .route('/uploads/blogs/thumbnail')
    .post(upload.single('thumbnail'), uploadBlogPostThumbnail)
router
    .route('/uploads/sizeMetrics/image')
    .post(upload.single('image'), uploadSizeMetricImage)

// Regions
router.route('/regions').get(getRegions).post(createRegion)
router
    .route('/regions/:id')
    .get(getRegion)
    .patch(updateRegion)
    .delete(deleteRegion)

// Products
router.route('/products').get(getProducts).post(createProduct)
router
    .route('/products/:id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct)

// Categories
router
    .route('/productCategories')
    .get(getProductCategories)
    .post(createProductCategory)
router
    .route('/productCategories/:id')
    .get(getProductCategory)
    .patch(updateProductCategory)
    .delete(deleteProductCategory)

// Collections
router
    .route('/productCollections')
    .get(getProductCollections)
    .post(createProductCollection)
router
    .route('/productCollections/:id')
    .get(getProductCollection)
    .patch(updateProductCollection)
    .delete(deleteProductCollection)

// Payment Methods
router.route('/paymentMethods').get(getPaymentMethods).post(createPaymentMethod)
router
    .route('/paymentMethods/:id')
    .get(getPaymentMethod)
    .patch(updatePaymentMethod)
    .delete(deletePaymentMethod)

// Sales
router.route('/sales').get(getSales).post(createSale)
router.route('/sales/:id').get(getSale).patch(updateSale).delete(deleteSale)

// Discounts
router.route('/discounts').get(getDiscounts).post(createDiscount)
router
    .route('/discounts:id')
    .get(getDiscount)
    .patch(updateDiscount)
    .delete(deleteDiscount)

// Countries
router.route('/countries').get(getCountries)
router.route('/countries/:id').get(getCountry)

// Currencies
router.route('/currencies').get(getCurrencies)
router.route('/currencies/:id').get(getCurrency)

// Shipping
router
    .route('/shippingMethods')
    .get(getShippingMethods)
    .post(createShippingMethod)
router
    .route('/shippingMethods/:id')
    .get(getShippingMethod)
    .patch(updateShippingMethod)
    .delete(deleteShippingMethod)

// Blog posts
router.route('/blogs').get(getBlogPosts).post(createBlogPost)
router
    .route('/blogs/:id')
    .get(getBlogPost)
    .patch(updateBlogPost)
    .delete(deleteBlogPost)

// Newsletters
router.route('/newsletters').get(getNewsletters)
router.route('/newsletters/:id').get(getNewsletter).patch(updateNewsletter)

// Reviews
router.route('/productReviews').get(getProductReviews)
router
    .route('/productReviews/:id')
    .patch(updateProductReview)
    .delete(deleteProductReview)

// Size metrics
router.route('/sizeMetrics').get(getSizeMetrics).post(createSizeMetric)
router
    .route('/sizeMetrics/:id')
    .get(getSizeMetric)
    .patch(updateSizeMetric)
    .delete(deleteSizeMetric)

export default router
