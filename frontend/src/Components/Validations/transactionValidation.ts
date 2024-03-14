import { z } from 'zod'
import dayjs from 'dayjs'

export const transactionSchema = z
  .object({
    category: z.object({
      name: z.string().min(1, {
        message: 'La categoría es requerida'
      }),
      iconName: z.string().min(1, {
        message: 'El nombre del ícono de la categoría es requerido'
      })
    }),
    amount: z
      .number({
        invalid_type_error: 'Debe ingresar solo números'
      })
      .min(1, {
        message: 'El monto es requerido'
      }),
    description: z.string().min(1, {
      message: 'La descripción es requerida'
    }),
    isPayment: z.boolean(),
    notificationEnabled: z.boolean(),
    paymentDueDate: z.date().optional()
  })
  .refine(
    (data) => !data.notificationEnabled || (data.notificationEnabled && data.paymentDueDate),
    {
      message: 'La fecha de notificación es requerida',
      path: ['paymentDueDate']
    }
  )
  .refine(
    (data) => {
      if (!data.paymentDueDate) return true
      const now = dayjs()
      const paymentDueDate = dayjs(data.paymentDueDate)
      return paymentDueDate.isAfter(now)
    },
    {
      message:
        'La fecha y hora de notificación no pueden ser anteriores a la fecha y hora actuales',
      path: ['paymentDueDate']
    }
  )
