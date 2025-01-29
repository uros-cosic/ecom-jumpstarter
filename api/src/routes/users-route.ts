import { Router } from 'express'

import { protect } from '../controllers/auth-controller'
import { getMe, getUser, updateMe } from '../controllers/user-controller'

const router = Router()

router.use(protect)

router.route('/me').get(getMe, getUser)
router.route('/updateMe').patch(updateMe)

export default router
