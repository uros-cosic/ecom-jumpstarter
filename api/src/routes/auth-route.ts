import { Router } from 'express'

import {
    logIn,
    logOut,
    protect,
    refreshToken,
    register,
    resetPassword,
    updatePassword,
} from '../controllers/auth-controller'

const router = Router()

router.route('/login').post(logIn)
router.route('/register').post(register)
router.route('/refresh').post(refreshToken)
router.route('/logout').post(protect, logOut)
router.route('/changePassword').patch(protect, updatePassword)
router.route('/resetPassword').post(resetPassword)

export default router
