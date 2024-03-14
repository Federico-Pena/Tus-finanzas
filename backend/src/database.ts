import mongoose from 'mongoose'
import 'dotenv/config.js'
const url = process.env.URL_DB as string
export const connectToDatabase = (): void => {
  mongoose
    .connect(url)
    .then(() => console.log(`Conexión exitosa a la base de datos: ${mongoose.connection.name}`))
    .catch((error) => {
      console.error('Error al conectar a la base de datos:', error)
      throw error
    })
}
