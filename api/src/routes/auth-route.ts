import { Router } from 'express'

import {
    logIn,
    logOut,
    protect,
    register,
    resetPassword,
    updatePassword,
} from '../controllers/auth-controller'

const router = Router()

router.route('/login').post(logIn)
router.route('/register').post(register)
router.route('/logout').post(logOut)
router.route('/changePassword').patch(protect, updatePassword)
router.route('/resetPassword').post(resetPassword)

export default router
