import { Request, Response } from 'express'
import { sendResponse } from '../../utils/response'
import { Transaction } from '../../models/transaction'
import User from '../../models/user'

export const deleteTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactionId = req.params.id
    const { name } = JSON.parse(req.params.token)

    const user = await User.findOne({ username: name })

    if (user === null) {
      return sendResponse(res, 404, {
        error: 'El usuario no existe.'
      })
    }
    const transaction = await Transaction.findOne({ _id: transactionId, user: user._id })

    if (transaction === null) {
      return sendResponse(res, 404, {
        error: 'Transacción no encontrada o no pertenece al usuario.'
      })
    }

    const transactionDeleted = await Transaction.findByIdAndDelete(transactionId)
    if (transactionDeleted === null) {
      return sendResponse(res, 500, {
        error: 'Error al borrar la transacción.'
      })
    }
    sendResponse(res, 200, {
      data: transactionDeleted,
      message: 'Transacción eliminada con éxito.'
    })
  } catch (error) {
    sendResponse(res, 500, { error: 'Error interno del servidor.' })
  }
}
