import { Router } from 'express'

import { getRegion, getRegions } from '../controllers/region-controller'

const router = Router()

router.route('/').get(getRegions)
router.route('/:id').get(getRegion)

export default router
