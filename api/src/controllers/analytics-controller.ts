import { OrderAnalytics } from '../models/OrderAnalytics'
import { SiteAnalytics } from '../models/SiteAnalytics'
import { getAll, getOne } from './handler-factory'

export const getSiteAnalytics = getAll(SiteAnalytics)
export const getSiteAnalytic = getOne(SiteAnalytics)
export const getOrderAnalytics = getAll(OrderAnalytics)
export const getOrderAnalytic = getOne(OrderAnalytics)
