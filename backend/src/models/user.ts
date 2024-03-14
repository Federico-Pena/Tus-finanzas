import mongoose, { Schema } from 'mongoose'
import { IUser } from '../types'

const userSchema: Schema = new Schema({
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  pushToken: { type: String, trim: true }
})

export default mongoose.model<IUser>('User', userSchema)
