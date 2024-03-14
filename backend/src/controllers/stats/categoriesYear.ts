import { Request, Response } from 'express'
import { sendResponse } from '../../utils/response'
import { Transaction } from '../../models/transaction'
import User from '../../models/user'

export const transactionStatsByYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year } = req.params
    const { name } = JSON.parse(req.params.token)
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`)
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`)

    const user = await User.findOne({ username: name })
    if (user === null) {
      return sendResponse(res, 404, {
        error: 'El usuario no existe.'
      })
    }

    const statsByMonth = await Transaction.aggregate([
      {
        $match: {
          user: user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            category: '$category.name',
            isPayment: '$isPayment'
          },
          amount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ])

    sendResponse(res, 200, {
      data: statsByMonth
    })
  } catch (error) {
    console.error(error)
    sendResponse(res, 500, {
      error: 'Error interno del servidor.'
    })
  }
}
