import express from 'express'
import Movies from '../models/movies';
import { createMovie, deleteMovie, getMovieById, getMovies, updateMovie } from '../controllers/movieController';
import { getCurrentUser, login, signup } from '../controllers/userController'
import secureRoute from '../middleware/secureRoute';

const router = express.Router()

// getting my movies
router.route('/api/movies').get(getMovies)

// Getting an individual movie
router.route('/api/movies/:movieId').get(getMovieById)

// Posting a movie
// ! This route is now secure
router.route('/api/movies').post(secureRoute, createMovie)

// Delete a movie
// ! This route is now secure
router.route('/api/movies/:movieId').delete(secureRoute, deleteMovie)

// Put a movie
// ! This route is now secure
router.route('/api/movies/:movieId').put(secureRoute, updateMovie)

// signup a new user
router.route('/api/signup').post(signup)

// login a user
router.route('/api/login').post(login)

// ! Adding a get current user
router.route('/api/user').get(secureRoute, getCurrentUser)

export default router

