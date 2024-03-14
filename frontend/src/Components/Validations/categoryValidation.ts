import { z } from 'zod'
export const categorySchema = z.object({
  category: z.object({
    name: z.string().min(1, {
      message: 'El nombre es requerido'
    }),
    iconName: z.string().min(1, {
      message: 'El icono es requerido'
    })
  }),
  isDefault: z.boolean()
})
