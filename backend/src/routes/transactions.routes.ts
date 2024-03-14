import { Router } from 'express'
import { RUTES } from '../constants'
import { getTransactions } from '../controllers/transactions/getTransactions'
import { postTransactions } from '../controllers/transactions/postTransactions'
import { deleteTransactions } from '../controllers/transactions/deleteTransactions'
import { putTransactions } from '../controllers/transactions/putTransactions'
import authMiddleware from '../middleware/authorization'

export const transactionsRoutes = Router()

// Ruta para obtener todas las transacciones asociadas a un usuario específico.
transactionsRoutes.get(RUTES.TRANSACTIONS.getTransactions, authMiddleware, getTransactions)

// Ruta para crear una nueva transacción para un usuario específico.
transactionsRoutes.post(RUTES.TRANSACTIONS.postTransactions, authMiddleware, postTransactions)

// Ruta para actualizar una transacción existente para un usuario específico.
transactionsRoutes.put(RUTES.TRANSACTIONS.putTransactions, authMiddleware, putTransactions)

// Ruta para eliminar una transacción existente para un usuario específico.
transactionsRoutes.delete(RUTES.TRANSACTIONS.deleteTransactions, authMiddleware, deleteTransactions)
