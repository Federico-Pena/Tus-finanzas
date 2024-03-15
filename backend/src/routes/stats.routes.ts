import { Router } from 'express'
import { ROUTES } from '../constants'
import authMiddleware from '../middleware/authorization'
import { categoriesStats } from '../controllers/stats/categoriesStats'
import { transactionStatsByYear } from '../controllers/stats/categoriesYear'
import { categoriesMonth } from '../controllers/stats/categoriesMonth'

export const statsRoutes = Router()

statsRoutes.get(ROUTES.STATS.getCategoriesStats, authMiddleware, categoriesStats)
statsRoutes.get(ROUTES.STATS.getCategoriesStatsYear, authMiddleware, transactionStatsByYear)
statsRoutes.get(ROUTES.STATS.getCategoriesStatsMonth, authMiddleware, categoriesMonth)
