import { Router } from 'express'

import { getCountries, getCountry } from '../controllers/country-controller'

const router = Router()

router.route('/').get(getCountries)
router.route('/:id').get(getCountry)

export default router
