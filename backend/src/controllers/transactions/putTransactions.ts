import { Request, Response } from 'express'
import { sendResponse } from '../../utils/response'
import { Transaction } from '../../models/transaction'
import User from '../../models/user'
import { Category } from '../../models/category'
import Notification from '../../models/notification'

export const putTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactionId = req.params.id
    const { name } = JSON.parse(req.params.token)
    const { category, amount, description, isPayment, date, paymentDueDate, notificationEnabled } =
      req.body

    const user = await User.findOne({ username: name })

    if (user === null) {
      return sendResponse(res, 404, {
        error: 'El usuario no existe.'
      })
    }

    const categorySaved = await Category.findOne({ name: category })

    if (categorySaved === null) {
      return sendResponse(res, 404, {
        error: 'La categoría no existe.'
      })
    }

    const transaction = await Transaction.findOne({ _id: transactionId, user: user._id })

    if (transaction === null) {
      return sendResponse(res, 404, {
        error: 'Transacción no encontrada o no pertenece al usuario.'
      })
    }

    if (notificationEnabled === true && paymentDueDate !== undefined) {
      const notificationDate = new Date(paymentDueDate)
      const bodyMessage = `${String(description)}, $${Number(amount)}.`

      const title = `Recordatorio de ${isPayment === true ? 'Ingreso' : 'Gasto'}`

      const notification = new Notification({
        body: bodyMessage,
        title,
        to: user.pushToken,
        sendAt: notificationDate
      })

      await notification.save()
    }

    transaction.category = categorySaved._id ?? transaction.category
    transaction.amount = amount ?? transaction.amount
    transaction.description = description ?? transaction.description
    transaction.date = date ?? transaction.date
    transaction.isPayment = isPayment ?? transaction.isPayment
    transaction.paymentDueDate = paymentDueDate ?? transaction.paymentDueDate
    transaction.notificationEnabled = notificationEnabled ?? transaction.notificationEnabled

    await transaction.save()
    const transactionUpdated = await Transaction.findById(transaction._id)
      .populate('category')
      .populate('user', 'username')

    sendResponse(res, 200, {
      message: 'Transacción actualizada con éxito.',
      data: transactionUpdated
    })
  } catch (error) {
    sendResponse(res, 500, { error: 'Error interno del servidor.' })
  }
}
