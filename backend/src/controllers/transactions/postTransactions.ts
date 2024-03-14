import { Request, Response } from 'express'
import { sendResponse } from '../../utils/response'
import { Transaction } from '../../models/transaction'
import { Category } from '../../models/category'
import User from '../../models/user'
import Notification from '../../models/notification'

export const postTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = JSON.parse(req.params.token)
    const { category, amount, description, isPayment, paymentDueDate, notificationEnabled, date } =
      req.body

    const invalidContent =
      category === undefined ||
      category.length === 0 ||
      amount === undefined ||
      amount.length === 0 ||
      description === undefined ||
      description.length === 0
    let notificationDateTransaction
    if (invalidContent) {
      sendResponse(res, 400, { error: 'Faltan campos obligatorios para crear la transacción.' })
      return
    }
    const categorySaved = await Category.findOne({ name: category })
    if (categorySaved === null) {
      sendResponse(res, 404, { error: 'La categoría no existe.' })
      return
    }

    const user = await User.findOne({ username: name })
    if (user === null) {
      return sendResponse(res, 404, {
        error: 'El usuario no existe.'
      })
    }
    if (notificationEnabled === true && paymentDueDate !== undefined) {
      const notificationDate = new Date(paymentDueDate)
      notificationDateTransaction = notificationDate.toUTCString()
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

    const newTransaction = new Transaction({
      user: user._id,
      category: categorySaved._id,
      amount,
      description,
      date: new Date(date).toUTCString(),
      isPayment,
      paymentDueDate: notificationDateTransaction,
      notificationEnabled
    })

    const transaction = await newTransaction.save()
    if (transaction === null) {
      sendResponse(res, 500, { error: 'Error al agregar la transacción' })
      return
    }

    const transactionUpdated = await Transaction.findById(transaction._id)
      .populate('category')
      .populate('user', 'username')
    sendResponse(res, 200, { data: transactionUpdated, message: 'Transacción creada con éxito' })
  } catch (error) {
    sendResponse(res, 500, { error: 'Error interno del servidor.' })
  }
}
