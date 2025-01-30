import { Router } from 'express'

import authRoute from './auth-route'
import storeRoute from './store-route'
import adminRoute from './admin-route'
import webhookRoute from './webhook-route'

const router = Router()

router.use('/auth', authRoute)
router.use('/store', storeRoute)
router.use('/webhook', webhookRoute)
router.use('/admin', adminRoute)

export default router
