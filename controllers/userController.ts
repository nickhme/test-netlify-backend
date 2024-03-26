import { Request, Response } from "express"
import User, { checkPasswords, validatePassword } from "../models/users"
import { SECRET } from '../config/environment'

import jwt from 'jsonwebtoken'
import formatValidationError from "../errors/validation"

export async function signup(req: Request, res: Response) {
  try {
    console.log(req.body)
    if (checkPasswords(req.body.password, req.body.passwordConfirmation)) {
      const user = await User.create(req.body)
      res.send(user)
    } else {
      // ! I've also edited this line.
      res.status(400).send({ message: "Passwords do not match.", errors: { password: "Does not match password "}  })
    }
  } catch (e) {
    console.log(e)
    // ! I will provide more detailed info about the error, using formatValidationError
    res.status(400).send({ message: "There was an error", errors: formatValidationError(e) })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const password = req.body.password

    const user = await User.findOne({ email: req.body.email })

    if (!user) return res.status(401).send({ message: "Login failed" })

    const isValidPw = validatePassword(password, user.password)

    if (isValidPw) {
      const token = jwt.sign( // makes a new token!
        { userId: user._id }, // we're encoding the user id on the token as userId
        SECRET, // we are then passing through a secret only we know.
        { expiresIn: '24h' } // and an expiry of the token
      )

      res.send({ message: "Login successful", token })
    } else {
      res.status(401).send({ message: "Login failed" })
    }
    res.send(req.body)
  } catch (e) {

  }
}

// ! I want to make a secure endopint that gives me all the details for the logged in user.
// ! We need the function to get the FULL USER DETAILS For the the current user.
export async function getCurrentUser(req: Request, res: Response) {
  try {
    res.status(200).send(res.locals.currentUser)
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "There was an error, please try again later."})
  }
}