import { z } from 'zod'
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: 'El nombre de usuario debe contener al entre 3 y 12 caracteres'
    })
    .max(12, {
      message: 'El nombre de usuario debe contener al entre 3 y 12 caracteres'
    }),
  email: z.string().email({
    message: 'Ingrese un email valido'
  }),
  password: z.string().refine((data) => passwordRegex.test(data.trim()), {
    message:
      'La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número.'
  })
})
