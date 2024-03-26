import mongoose, { Schema } from 'mongoose'
// ! Import bcrypt to hash the password
import bcrypt from "bcrypt"
import uniqueValidator from "mongoose-unique-validator"
import validator from 'validator'
import mongooseHidden from 'mongoose-hidden'

interface IUser {
  username: string,
  email: string,
  password: string
}

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email: string) => validator.isEmail(email)
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: (password: string) => {
      return validator.isStrongPassword(
        password, {
        minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1
      })
    }
  }
})

/// SIGNUP ----------

// ! Before we save to the database "pre-saving", we want to run some code.
// ! This code I'm going to run will hash the password before saving.
userSchema.pre('save', function hashPassword(next) {
  // ! "this" is our document, it will have our email, password, and username available.
  // ! hashSync is a bcrypt function, it takes our password, plus a salt, and creates a unique hash.
  console.log("here is the password", this.password)
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  console.log("here is the updated password", this.password)
  // ! Call next() to tell mongoose we're done.
  next()
})

/// LOGIN -----------

// ! Add a function to compare the two hashed passwords
export function validatePassword(loginPlaintextPassword: string, originalHashedPassword: string) {
  return bcrypt.compareSync(loginPlaintextPassword, originalHashedPassword);
}

export function checkPasswords(password: string, passwordConfirmation: string) {
  return password == passwordConfirmation
}

// ! This will hide certain fields from response
userSchema.plugin(
  mongooseHidden({ defaultHidden: { password: true } })
)

userSchema.plugin(uniqueValidator)

export default mongoose.model<IUser>('User', userSchema)