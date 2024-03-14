import { Request, Response } from 'express'
import { sendResponse } from '../../utils/response'
import { Transaction } from '../../models/transaction'
import User from '../../models/user'

export const categoriesStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = JSON.parse(req.params.token)

    const user = await User.findOne({ username: name })
    if (user === null) {
      return sendResponse(res, 404, {
        error: 'El usuario no existe.'
      })
    }
    const statsByCategoryAndType = await Transaction.aggregate([
      { $match: { user: user._id } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: '$categoryDetails' },
      {
        $group: {
          _id: {
            category: '$categoryDetails.name',
            isPayment: '$isPayment'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.category': 1, '_id.isPayment': -1 } }
    ])

    sendResponse(res, 200, {
      data: statsByCategoryAndType
    })
  } catch (error) {
    console.error(error)
    sendResponse(res, 500, {
      error: 'Error interno del servidor.'
    })
  }
}
