import { Router } from 'express'

import {
    getSizeMetric,
    getSizeMetrics,
} from '../controllers/size-metric-controller'

const router = Router()

router.route('/').get(getSizeMetrics)
router.route('/:id').get(getSizeMetric)

export default router
