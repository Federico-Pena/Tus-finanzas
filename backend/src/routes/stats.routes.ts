import { Router } from 'express'
import { RUTES } from '../constants'
import authMiddleware from '../middleware/authorization'
import { categoriesStats } from '../controllers/stats/categoriesStats'
import { transactionStatsByYear } from '../controllers/stats/categoriesYear'
import { categoriesMonth } from '../controllers/stats/categoriesMonth'

export const statsRoutes = Router()

statsRoutes.get(RUTES.STATS.getCategoriesStats, authMiddleware, categoriesStats)
statsRoutes.get(RUTES.STATS.getCategoriesStatsYear, authMiddleware, transactionStatsByYear)
statsRoutes.get(RUTES.STATS.getCategoriesStatsMonth, authMiddleware, categoriesMonth)
