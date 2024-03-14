import { Schema, model } from 'mongoose'
import { ICategory } from '../types'

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  iconName: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  isDefault: { type: Boolean, default: false }
})

export const Category = model<ICategory>('Category', CategorySchema)
