// * This file is responsible for defining your own model (type) for your data (movie)

import mongoose, { Schema } from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"

interface IMovie {
  name: string,
  year: number,
  image: string,
  // ! Added a field to our interface.
  user: mongoose.Schema.Types.ObjectId
} 

const movieSchema: Schema<IMovie> = new mongoose.Schema<IMovie>({
  name: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  image: { type: String, required: true },
  // ! Adding something called a 'reference relationship'
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

movieSchema.plugin(uniqueValidator)

export default mongoose.model<IMovie>('Movie', movieSchema)