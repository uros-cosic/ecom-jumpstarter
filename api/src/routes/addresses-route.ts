import { Router } from 'express'

import {
    createAddress,
    deleteAddress,
    getAddress,
    updateAddress,
} from '../controllers/address-controller'
import { protect } from '../controllers/auth-controller'

const router = Router()

router.route('/').post(createAddress)

router
    .route('/:id')
    .get(getAddress)
    .patch(protect, updateAddress)
    .delete(protect, deleteAddress)

export default router
