import express from 'express'
import mongoose from 'mongoose'
import router from './views/router'
import mongoSanitize from 'express-mongo-sanitize'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(express.json())
// ! Sanitisation
app.use(mongoSanitize())
app.use(router)

console.log(process.env.MONGO_DB_URL)

async function start() {
  await mongoose.connect('mongodb://127.0.0.1:27017/moviesdb')
  console.log('Connected to the database! 🔥')

  app.listen(8000, () => {
    console.log('Express API is running on http://localhost:8000')
  })
}

start()

