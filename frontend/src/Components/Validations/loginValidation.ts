import { z } from 'zod'
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/
export const loginSchema = z.object({
  usernameOrEmail: z.string(),
  password: z.string().refine((data) => passwordRegex.test(data.trim()), {
    message:
      'La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número.'
  })
})
