import dayjs from 'dayjs'
import { RouteParams } from './types'

export const defaultValues = (routesParams: RouteParams) => {
  let defaultValuesForm

  if (routesParams?.transaction) {
    const { amount, category, description, isPayment, notificationEnabled, paymentDueDate } =
      routesParams.transaction
    return {
      amount: amount,
      category: {
        name: category.name,
        iconName: category.iconName
      },
      description: description,
      isPayment: isPayment,
      notificationEnabled: notificationEnabled,
      paymentDueDate: notificationEnabled ? dayjs(paymentDueDate).toDate() : undefined
    }
  } else {
    defaultValuesForm = {
      amount: 0,
      category: {
        name: '',
        iconName: ''
      },
      description: '',
      isPayment: false,
      notificationEnabled: false,
      paymentDueDate: undefined
    }
  }
  return defaultValuesForm
}
