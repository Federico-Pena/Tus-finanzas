import { Request, Response } from 'express'
import { sendResponse } from '../../utils/response'
import { Transaction } from '../../models/transaction'
import User from '../../models/user'

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = JSON.parse(req.params.token)

    const page = parseInt(req.query.page as string) ?? 1
    const limit = 20
    const skipIndex = (page - 1) * limit
    const user = await User.findOne({ username: name })
    if (user === null) {
      return sendResponse(res, 404, { error: 'El usuario no existe.' })
    }
    const transactions = await Transaction.find({
      user: user._id
    })
      .populate('category')
      .populate('user', 'username')
      .sort({ date: -1 })
      .limit(limit)
      .skip(skipIndex)
      .exec()

    const totalCount = transactions.length
    const totalPages = Math.ceil(totalCount / limit)
    if (transactions.length > 0) {
      sendResponse(res, 200, {
        data: { transactions, page, totalCount, totalPages }
      })
    } else {
      sendResponse(res, 404, { error: 'No se encontraron transacciones.' })
    }
  } catch (error) {
    sendResponse(res, 500, {
      error: 'Error interno del servidor.'
    })
  }
}
