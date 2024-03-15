import { Router } from 'express'
import { ROUTES } from '../constants'
import { getCategories } from '../controllers/categories/getCategories'
import { postCategories } from '../controllers/categories/postCategories'
import { putCategories } from '../controllers/categories/putCategories'
import { deleteCategories } from '../controllers/categories/deleteCategories'
import authMiddleware from '../middleware/authorization'

export const categoriesRoutes = Router()

// Ruta para obtener todas las categorías asociadas a un usuario específico y las predeterminadas.
categoriesRoutes.get(ROUTES.CATEGORIES.getCategories, authMiddleware, getCategories)

// Ruta para crear una nueva categoría para un usuario específico.
categoriesRoutes.post(ROUTES.CATEGORIES.postCategories, authMiddleware, postCategories)

// Ruta para actualizar una categoría existente para un usuario específico.
categoriesRoutes.put(ROUTES.CATEGORIES.putCategories, authMiddleware, putCategories)

// Ruta para eliminar una categoría existente para un usuario específico.
categoriesRoutes.delete(ROUTES.CATEGORIES.deleteCategories, authMiddleware, deleteCategories)
