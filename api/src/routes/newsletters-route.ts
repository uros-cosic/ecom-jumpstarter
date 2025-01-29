import { Router } from 'express'

import {
    createNewsletter,
    deleteNewsletter,
} from '../controllers/newsletter-controller'

const router = Router()

router.route('/').post(createNewsletter)
router.route('/unsubscribe').delete(deleteNewsletter)

export default router
